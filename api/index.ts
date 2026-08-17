import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

// ── 1. PRISMA CLIENT WITH SERVERLESS PG ADAPTER ────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new PrismaClient();
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// ── 2. AUDIT LOGGING & DATA SANITIZATION ──────────────────────────

const logDir = process.env.VERCEL 
  ? path.join("/tmp", "logs") 
  : path.join(process.cwd(), "logs");

try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  // Silent fallback in serverless environments
}

const auditLogPath = path.join(logDir, "audit.log");

function sanitizeForLogs(str: string): string {
  if (!str) return "";
  return str.replace(/[\r\n]+/g, " ").trim();
}

export function redactSensitiveData(data: any): any {
  if (!data) return data;
  if (typeof data !== "object") return data;

  const sensitiveKeys = [
    "password", "senha", "token", "cookie", "secret", "hash",
    "apiKey", "key", "newPassword", "currentPassword",
    "authorization", "accessToken", "refreshToken", "idToken"
  ];

  const redacted = { ...data };
  for (const key of Object.keys(redacted)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof redacted[key] === "object" && redacted[key] !== null) {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }
  return redacted;
}

export interface AuditEvent {
  action: "LOGIN" | "LOGOUT" | "PASSWORD_CHANGE" | "PROFILE_UPDATE" | "ROLE_UPDATE" | "ACCOUNT_DELETION" | "SIGNUP" | "ACCESS_RESOURCE";
  userId: string;
  userEmail: string;
  status: "SUCCESS" | "FAILURE";
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

export function logAuditEvent(event: AuditEvent): void {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    action: event.action,
    userId: sanitizeForLogs(event.userId),
    userEmail: sanitizeForLogs(event.userEmail),
    status: event.status,
    ipAddress: sanitizeForLogs(event.ipAddress || "unknown"),
    userAgent: sanitizeForLogs(event.userAgent || "unknown"),
    details: sanitizeForLogs(event.details || ""),
  };

  try {
    fs.appendFileSync(auditLogPath, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    // In serverless, standard console output is standard
  }

  console.log(`[AUDIT] ${timestamp} | ACTION=${entry.action} | USER=${entry.userEmail} | STATUS=${entry.status} | IP=${entry.ipAddress}`);
}

// ── 3. BETTER AUTH CONFIGURATION ──────────────────────────────────

const FALLBACK_SECRET = "vance-library-super-secret-key-32-chars-minimum-dev-fallback";

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) return "https://vancelib.vercel.app";
  return "http://localhost:5173";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  secret: process.env.BETTER_AUTH_SECRET || FALLBACK_SECRET,
  baseURL: getBaseUrl(),

  trustedOrigins: [
    "https://vancelib.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      requireLocalEmailVerified: false,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ativo",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[PASSWORD RESET] To: ${user.email} | Link: ${url}`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[VERIFICATION EMAIL] To: ${user.email} | Link: ${url}`);
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  
  advanced: {
    cookiePrefix: "vance-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    trustProxy: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          logAuditEvent({
            action: "SIGNUP",
            userId: user.id,
            userEmail: user.email,
            status: "SUCCESS",
            details: `Registered new user: ${user.name}`,
          });
        },
      },
      update: {
        after: async (user) => {
          logAuditEvent({
            action: "PROFILE_UPDATE",
            userId: user.id,
            userEmail: user.email,
            status: "SUCCESS",
            details: "Updated user profile data",
          });
        },
      },
      delete: {
        after: async (user) => {
          logAuditEvent({
            action: "ACCOUNT_DELETION",
            userId: user.id,
            userEmail: user.email,
            status: "SUCCESS",
            details: "Deleted user account",
          });
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          try {
            const user = await prisma.user.findUnique({ where: { id: session.userId } });
            logAuditEvent({
              action: "LOGIN",
              userId: session.userId,
              userEmail: user?.email || "unknown",
              status: "SUCCESS",
              ipAddress: session.ipAddress || undefined,
              userAgent: session.userAgent || undefined,
              details: "Successful login and session generation",
            });
          } catch (e) {}
        },
      },
      delete: {
        before: async (session) => {
          try {
            const user = await prisma.user.findUnique({ where: { id: session.userId } });
            logAuditEvent({
              action: "LOGOUT",
              userId: session.userId,
              userEmail: user?.email || "unknown",
              status: "SUCCESS",
              ipAddress: session.ipAddress || undefined,
              userAgent: session.userAgent || undefined,
              details: "User logged out",
            });
          } catch (e) {}
        },
      },
    },
  },
});

// ── 4. BILLING GATEWAY & ENGINE ───────────────────────────────────

export interface PaymentGateway {
  name: string;
  createCustomer(user: { id: string; name: string; email: string; cpfCnpj?: string; mobilePhone?: string }): Promise<string>;
  createSubscription(params: {
    gatewayCustomerId: string;
    value: number;
    cycle: "WEEKLY" | "MONTHLY" | "YEARLY";
    billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
    nextDueDate: Date;
    description: string;
  }): Promise<{ gatewaySubscriptionId: string; invoiceUrl?: string; checkoutUrl?: string; invoiceId?: string }>;
  cancelSubscription(gatewaySubscriptionId: string): Promise<void>;
  updateSubscription(gatewaySubscriptionId: string, params: { value: number }): Promise<void>;
}

export class AsaasGateway implements PaymentGateway {
  public readonly name = "Asaas";
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || "";
    this.apiUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "access_token": this.apiKey,
    };
  }

  async createCustomer(user: { id: string; name: string; email: string; cpfCnpj?: string; mobilePhone?: string }): Promise<string> {
    const response = await fetch(`${this.apiUrl}/customers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        cpfCnpj: user.cpfCnpj || undefined,
        mobilePhone: user.mobilePhone || undefined,
        externalReference: user.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as any;
    return data.id;
  }

  async createSubscription(params: any): Promise<any> {
    const formattedDate = params.nextDueDate.toISOString().split("T")[0];
    const response = await fetch(`${this.apiUrl}/subscriptions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        customer: params.gatewayCustomerId,
        billingType: params.billingType,
        value: params.value,
        nextDueDate: formattedDate,
        cycle: params.cycle,
        description: params.description,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as any;
    return {
      gatewaySubscriptionId: data.id,
      invoiceUrl: data.invoiceUrl || undefined,
      checkoutUrl: data.bankSlipUrl || data.checkoutUrl || undefined,
    };
  }

  async cancelSubscription(gatewaySubscriptionId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/subscriptions/${gatewaySubscriptionId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
    }
  }

  async updateSubscription(gatewaySubscriptionId: string, params: { value: number }): Promise<void> {
    const response = await fetch(`${this.apiUrl}/subscriptions/${gatewaySubscriptionId}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ value: params.value }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
    }
  }
}

export class BillingEngine {
  private readonly gateway: PaymentGateway;
  private readonly webhookToken: string;

  constructor() {
    this.gateway = new AsaasGateway();
    this.webhookToken = process.env.ASAAS_WEBHOOK_TOKEN || "vance-library-webhook-secret-dev-fallback";
  }

  private async logBilling(message: string, level: "info" | "warn" | "error", details?: string) {
    try {
      await prisma.billingLog.create({
        data: { message, level, details },
      });
      console.log(`[BILLING ${level.toUpperCase()}] ${message}`);
    } catch (err) {
      console.error("Failed to write billing log to DB:", err);
    }
  }

  async createSubscription(params: { userId: string; planSlug: string; billingType: "BOLETO" | "PIX" | "CREDIT_CARD" }) {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: { subscriptions: true },
    });

    if (!user) throw new Error("User not found.");

    const existingActive = user.subscriptions.find((s: any) => s.status === "ativa");
    if (existingActive) throw new Error("User already has an active subscription.");

    const plan = await prisma.plan.findUnique({
      where: { slug: params.planSlug },
    });

    if (!plan || !plan.ativo) throw new Error(`Plan '${params.planSlug}' is not available.`);

    let gatewayCustomerId = user.subscriptions.find((s: any) => s.gateway_customer_id)?.gateway_customer_id;
    if (!gatewayCustomerId) {
      gatewayCustomerId = await this.gateway.createCustomer({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 3);
    const cycle = plan.intervalo === "anual" ? "YEARLY" : "MONTHLY";

    const gatewayResult = await this.gateway.createSubscription({
      gatewayCustomerId,
      value: plan.preco,
      cycle,
      billingType: params.billingType,
      nextDueDate,
      description: `Assinatura Plano ${plan.nome} - Vance Library`,
    });

    const dbSubscription = await prisma.subscription.create({
      data: {
        user_id: user.id,
        plano_id: plan.id,
        gateway_customer_id: gatewayCustomerId,
        gateway_subscription_id: gatewayResult.gatewaySubscriptionId,
        status: "pendente",
        inicio: new Date(),
        fim: plan.intervalo === "anual" 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        renovacao: nextDueDate,
      },
    });

    await prisma.transaction.create({
      data: {
        subscription_id: dbSubscription.id,
        user_id: user.id,
        amount: plan.preco,
        status: "pendente",
        payment_method: params.billingType,
        gateway_payment_id: gatewayResult.invoiceId || null,
        invoice_url: gatewayResult.invoiceUrl || null,
      },
    });

    return {
      subscriptionId: dbSubscription.id,
      gatewaySubscriptionId: gatewayResult.gatewaySubscriptionId,
      invoiceUrl: gatewayResult.invoiceUrl,
      checkoutUrl: gatewayResult.checkoutUrl,
    };
  }

  async cancelSubscription(userId: string): Promise<void> {
    const activeSub = await prisma.subscription.findFirst({
      where: { user_id: userId, status: "ativa" },
      include: { user: true },
    });

    if (!activeSub || !activeSub.gateway_subscription_id) {
      throw new Error("No active subscription found.");
    }

    await this.gateway.cancelSubscription(activeSub.gateway_subscription_id);

    await prisma.subscription.update({
      where: { id: activeSub.id },
      data: { status: "cancelada", cancelada_em: new Date() },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: "free" },
    });
  }

  async changePlan(userId: string, newPlanSlug: string): Promise<void> {
    const activeSub = await prisma.subscription.findFirst({
      where: { user_id: userId, status: "ativa" },
      include: { user: true },
    });

    if (!activeSub) throw new Error("No active subscription found.");

    const newPlan = await prisma.plan.findUnique({ where: { slug: newPlanSlug } });
    if (!newPlan || !newPlan.ativo) throw new Error(`Plan '${newPlanSlug}' is unavailable.`);

    await this.gateway.updateSubscription(activeSub.gateway_subscription_id!, { value: newPlan.preco });

    await prisma.subscription.update({
      where: { id: activeSub.id },
      data: { plano_id: newPlan.id },
    });
  }

  async handleWebhook(payload: any, accessTokenHeader: string | undefined): Promise<void> {
    if (!accessTokenHeader || accessTokenHeader !== this.webhookToken) {
      throw new Error("Unauthorized Webhook Access");
    }

    const eventId = payload.id;
    const eventType = payload.event;
    if (!eventId || !eventType) throw new Error("Malformed webhook payload");

    const existingEvent = await prisma.billingEvent.findUnique({ where: { gateway_event_id: eventId } });
    if (existingEvent) return;

    await prisma.billingEvent.create({
      data: {
        gateway_event_id: eventId,
        event_type: eventType,
        payload: JSON.stringify(payload),
        processed: false,
      },
    });

    if (eventType === "PAYMENT_RECEIVED" || eventType === "PAYMENT_CONFIRMED") {
      const subscriptionId = payload.payment?.subscription;
      if (subscriptionId) {
        const sub = await prisma.subscription.findFirst({ where: { gateway_subscription_id: subscriptionId } });
        if (sub) {
          await prisma.subscription.update({ where: { id: sub.id }, data: { status: "ativa" } });
          await prisma.user.update({ where: { id: sub.user_id }, data: { plan: "premium" } });
        }
      }
    }

    await prisma.billingEvent.update({ where: { gateway_event_id: eventId }, data: { processed: true } });
  }
}

// ── 5. EXPRESS APP & SECURITY MIDDLEWARE ──────────────────────────

const app = express();
app.set("trust proxy", true);
const billing = new BillingEngine();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://*"],
      mediaSrc: ["'self'", "https://*"],
      connectSrc: ["'self'", "http://localhost:3001", "ws://localhost:5173", "https://*"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

if (process.env.BETTER_AUTH_URL) allowedOrigins.push(process.env.BETTER_AUTH_URL);
if (process.env.VERCEL_URL) allowedOrigins.push(`https://${process.env.VERCEL_URL}`);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Policy Violation: Origin ${origin} not whitelisted.`));
    }
  },
  credentials: true,
}));

const getClientIp = (req: Request): string => {
  return (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
};

// ── 6. DIAGNOSTICS & SYSTEM ROUTES ────────────────────────────────

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      hasBetterAuthUrl: !!process.env.BETTER_AUTH_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
      hasGithubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    },
  });
});

app.get("/api/db-test", async (req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ success: true, userCount: count });
  } catch (err: any) {
    console.error("[DB TEST ERROR]", err);
    res.status(500).json({ error: "DB connection failed", message: err?.message || String(err) });
  }
});

// ── 7. MOUNT BETTER AUTH HANDLER ──────────────────────────────────

const authNodeHandler = toNodeHandler(auth);

app.all("/api/auth/*splat", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authNodeHandler(req, res);
  } catch (err: any) {
    console.error("[BetterAuth Error]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Better Auth Error", message: err?.message || String(err) });
    }
  }
});

app.all("/api/auth", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authNodeHandler(req, res);
  } catch (err: any) {
    console.error("[BetterAuth Error]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Better Auth Error", message: err?.message || String(err) });
    }
  }
});

// ── 8. PROTECTED & APPLICATION ROUTES ─────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export interface AuthenticatedRequest extends Request {
  session?: {
    session: any;
    user: any;
  } | null;
}

const requireSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized: Active session required." });
      return;
    }

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

app.get("/api/profile", requireSession, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.session?.user,
    session: req.session?.session,
  });
});

app.get("/api/user/favorites", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: req.session!.user.id },
      include: {
        component: {
          select: { id: true, titulo: true, slug: true, premium: true, preview_image: true }
        }
      }
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/favorites", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { componentId } = req.body;
    if (!componentId || typeof componentId !== "string") {
      res.status(400).json({ error: "Invalid componentId" });
      return;
    }
    const favorite = await prisma.favorite.create({
      data: { user_id: req.session!.user.id, component_id: componentId }
    });
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/user/favorites/:componentId", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.favorite.delete({
      where: {
        user_id_component_id: {
          user_id: req.session!.user.id,
          component_id: req.params.componentId as string,
        }
      }
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/delete-account", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({ where: { id: req.session!.user.id } });
    res.json({ success: true, message: "Account deleted successfully." });
  } catch (err) {
    next(err);
  }
});

app.post("/api/billing/subscribe", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { planSlug, billingType } = req.body;
    const result = await billing.createSubscription({
      userId: req.session!.user.id,
      planSlug,
      billingType,
    });
    res.json(result);
  } catch (err: any) {
    next(err);
  }
});

app.post("/api/billing/cancel", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await billing.cancelSubscription(req.session!.user.id);
    res.json({ success: true, message: "Subscription cancelled successfully." });
  } catch (err: any) {
    next(err);
  }
});

app.get("/api/billing/status", requireSession, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { user_id: req.session!.user.id, status: "ativa" },
      include: { plano: true },
    });

    res.json({
      plan: sub ? sub.plano.slug : "free",
      status: sub ? sub.status : "inativa",
      renovacao: sub ? sub.renovacao : null,
      hasActiveSub: !!sub,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/billing/webhook", async (req: Request, res: Response) => {
  try {
    const token = req.headers["asaas-access-token"] as string | undefined;
    await billing.handleWebhook(req.body, token);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: "Webhook failed" });
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${new Date().toISOString()} | PATH=${req.path} | MSG=${err?.message}`);
  res.status(err.status || 500).json({
    error: err?.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3001;

async function seedPlans() {
  try {
    const count = await prisma.plan.count();
    if (count === 0) {
      await prisma.plan.createMany({
        data: [
          { nome: "Plano Básico", slug: "basic", preco: 0.00, intervalo: "mensal", descricao: "Acesso básico às visualizações de componentes" },
          { nome: "Plano Padrão", slug: "standard", preco: 49.90, intervalo: "mensal", descricao: "Cópia de prompts ilimitada e suporte prioritário" },
          { nome: "Plano Pro", slug: "pro", preco: 99.90, intervalo: "mensal", descricao: "Acesso total aos componentes 3D e WebGL premium" },
        ]
      });
    }
  } catch (err) {}
}

if (!process.env.VERCEL) {
  seedPlans().then(() => {
    app.listen(PORT, () => {
      console.log(`[BACKEND SERVER] Running at http://localhost:${PORT}`);
    });
  });
}

export default app;
export { app };
