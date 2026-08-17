import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { logAuditEvent, redactSensitiveData } from "./audit";
import { BillingEngine } from "./billing/billing.engine";

const app = express();
app.set("trust proxy", true);
const billing = new BillingEngine();

// Configure Helmet with strict security headers
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

// Secure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

if (process.env.BETTER_AUTH_URL) {
  allowedOrigins.push(process.env.BETTER_AUTH_URL);
}
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

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

// Safe IP Extractor
const getClientIp = (req: Request): string => {
  return (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
};

// Rate Limiter Factory
interface RateLimitBucket {
  requests: number[];
}
const rateLimiterFactory = (windowMs: number, maxRequests: number, rateLimiterName: string) => {
  const store = new Map<string, RateLimitBucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${getClientIp(req)}:${req.path}`;
    const now = Date.now();
    
    let bucket = store.get(key);
    if (!bucket) {
      bucket = { requests: [] };
      store.set(key, bucket);
    }

    bucket.requests = bucket.requests.filter(timestamp => now - timestamp < windowMs);

    if (bucket.requests.length >= maxRequests) {
      console.warn(`[RATE LIMIT] ${rateLimiterName} exceeded by IP=${getClientIp(req)} on PATH=${req.path}`);
      res.status(429).json({
        error: `Too many requests. Please slow down and try again later.`,
      });
      return;
    }

    bucket.requests.push(now);
    next();
  };
};

const authLimiter = rateLimiterFactory(5 * 60 * 1000, 5, "AUTH_LIMITER");
const adminLimiter = rateLimiterFactory(1 * 60 * 1000, 15, "ADMIN_LIMITER");
const profileLimiter = rateLimiterFactory(1 * 60 * 1000, 10, "PROFILE_LIMITER");
const generalApiLimiter = rateLimiterFactory(1 * 60 * 1000, 100, "GENERAL_API");

// Diagnostics & Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
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
    res.status(500).json({ error: "DB connection failed", message: err?.message || String(err) });
  }
});

// Mount Better Auth Handler with safe error handling
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

// Express body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export interface AuthenticatedRequest extends Request {
  session?: {
    session: any;
    user: any;
  } | null;
}

// Session Validation Middleware
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

const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session || req.session.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin privileges required." });
    return;
  }
  next();
};

const requirePremium = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  if (req.session.user.role === "admin") {
    next();
    return;
  }

  try {
    const activeSub = await prisma.subscription.findFirst({
      where: {
        user_id: req.session.user.id,
        status: "ativa",
      },
    });

    if (!activeSub) {
      res.status(403).json({ error: "Forbidden: Premium subscription required." });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ── PROTECTED API ROUTE DEFINITIONS ───────────────────────────────

app.get("/api/profile", requireSession, generalApiLimiter, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.session?.user,
    session: req.session?.session,
  });
});

app.get("/api/user/favorites", requireSession, generalApiLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        component: {
          select: {
            id: true,
            titulo: true,
            slug: true,
            premium: true,
            preview_image: true,
          }
        }
      }
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/favorites", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const { componentId } = req.body;

    if (!componentId || typeof componentId !== "string") {
      res.status(400).json({ error: "Invalid or missing componentId" });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        component_id: componentId,
      }
    });

    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/user/favorites/:componentId", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const componentId = req.params.componentId as string;

    await prisma.favorite.delete({
      where: {
        user_id_component_id: {
          user_id: userId,
          component_id: componentId,
        }
      }
    });

    res.json({ success: true, message: "Favorite removed successfully" });
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/delete-account", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const userEmail = req.session!.user.email;

    await prisma.user.delete({
      where: { id: userId }
    });

    logAuditEvent({
      action: "ACCOUNT_DELETION",
      userId,
      userEmail,
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      details: "Self account deletion executed by user",
    });

    res.json({ success: true, message: "Account deleted successfully." });
  } catch (err) {
    next(err);
  }
});

app.get("/api/premium/content", requireSession, requirePremium, generalApiLimiter, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: "Welcome to the Premium Library! This content is fully protected.",
  });
});

app.put("/api/admin/users/:userId/role", requireSession, requireAdmin, adminLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.userId as string;

    if (!role || (role !== "user" && role !== "admin")) {
      res.status(400).json({ error: "Invalid role value (must be 'user' or 'admin')" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role }
    });

    logAuditEvent({
      action: "ROLE_UPDATE",
      userId: targetUserId,
      userEmail: updated.email,
      status: "SUCCESS",
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"],
      details: `Role updated to '${role}' by admin ${req.session!.user.email}`,
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
});

// ── BILLING ENGINE API ROUTES ─────────────────────────────────────

app.post("/api/billing/subscribe", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { planSlug, billingType } = req.body;
    if (!planSlug || !billingType || (billingType !== "PIX" && billingType !== "BOLETO" && billingType !== "CREDIT_CARD")) {
      res.status(400).json({ error: "Invalid parameters. Plan slug and valid billing type (PIX, BOLETO, CREDIT_CARD) are required." });
      return;
    }

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

app.post("/api/billing/cancel", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await billing.cancelSubscription(req.session!.user.id);
    res.json({ success: true, message: "Subscription cancelled successfully." });
  } catch (err: any) {
    next(err);
  }
});

app.post("/api/billing/change-plan", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { newPlanSlug } = req.body;
    if (!newPlanSlug) {
      res.status(400).json({ error: "Missing parameter: newPlanSlug" });
      return;
    }
    await billing.changePlan(req.session!.user.id, newPlanSlug);
    res.json({ success: true, message: "Subscription updated successfully." });
  } catch (err: any) {
    next(err);
  }
});

app.get("/api/billing/status", requireSession, generalApiLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

app.get("/api/billing/payments", requireSession, generalApiLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.transaction.findMany({
      where: { user_id: req.session!.user.id },
      orderBy: { created_at: "desc" },
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

app.post("/api/billing/webhook", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["asaas-access-token"] as string | undefined;
    await billing.handleWebhook(req.body, token);
    res.json({ success: true });
  } catch (err: any) {
    console.error(`[Webhook Ingestion Failure] ${err.message}`);
    res.status(err.status || 400).json({ error: "Webhook ingestion failed" });
  }
});

// Safe global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  const redactedError = redactSensitiveData({
    message: err.message,
    stack: err.stack,
    path: req.path,
    query: req.query,
    body: req.body,
  });

  console.error(`[ERROR] ${timestamp} | PATH=${req.path} | IP=${getClientIp(req)} | MSG=${redactedError.message}`);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  res.status(err.status || 500).json({
    error: err.message || "An unexpected error occurred. Please contact support.",
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
      console.log("[DB SEED] Default billing plans successfully seeded.");
    }
  } catch (err) {
    console.error("[DB SEED] Failed to seed default plans:", err);
  }
}

if (!process.env.VERCEL) {
  seedPlans().then(() => {
    app.listen(PORT, () => {
      console.log(`[BACKEND SERVER] Running at http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("[BACKEND SERVER] Startup error:", err);
  });
}

export default app;
export { app };
