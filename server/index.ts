import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { PrismaClient } from "@prisma/client";
import { logAuditEvent, redactSensitiveData } from "./audit";
import { BillingEngine } from "./billing/billing.engine";

const prisma = new PrismaClient();
const app = express();
app.set("trust proxy", true);
const billing = new BillingEngine();

// Rule 3.2: Configure Helmet with strict security headers (CSP, HSTS, X-Frame-Options)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for WebGL modules
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://*"],
      mediaSrc: ["'self'", "https://*"],
      connectSrc: ["'self'", "http://localhost:3001", "ws://localhost:5173", "https://*"],
      frameAncestors: ["'none'"], // Block embedding inside frames (prevent clickjacking)
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rule 2.2 & 4.3: Secure CORS - Only allow whitelisted domains, credentials enabled
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS Policy Violation: Origin not whitelisted."));
    }
  },
  credentials: true,
}));

// Safe IP Extractor
const getClientIp = (req: Request): string => {
  return (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
};

// Rate Limiter Factory (In-Memory Sliding Window Bucket)
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

    // Clean expired timestamps
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

// Define Specific Rate Limiters
const authLimiter = rateLimiterFactory(5 * 60 * 1000, 5, "AUTH_LIMITER");      // 5 requests per 5 minutes
const adminLimiter = rateLimiterFactory(1 * 60 * 1000, 15, "ADMIN_LIMITER");   // 15 requests per minute
const profileLimiter = rateLimiterFactory(1 * 60 * 1000, 10, "PROFILE_LIMITER"); // 10 requests per minute
const generalApiLimiter = rateLimiterFactory(1 * 60 * 1000, 100, "GENERAL_API"); // 100 requests per minute

// Apply specific rate limits to auth routes BEFORE mounting Better Auth
app.use("/api/auth/sign-in", authLimiter);
app.use("/api/auth/sign-up", authLimiter);
app.use("/api/auth/forget-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

// Mount Better Auth Handler (using Express 5 wildcard parameter format)
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Express body parsers (Mounted AFTER Better Auth to prevent stream consumption issues)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extend Request type to include session
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
      headers: req.headers,
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

// RBAC Middleware: Admin access
const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session || req.session.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin privileges required." });
    return;
  }
  next();
};

// RBAC Middleware: Premium access
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
    // Parameterized DB call via Prisma
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

// GET user profile info
app.get("/api/profile", requireSession, generalApiLimiter, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.session?.user,
    session: req.session?.session,
  });
});

// GET Favorites - Rule 1.2: Server-side validation of resource ownership (BOLA prevention)
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

// POST Favorite - Parametrizado, BOLA-safe
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

// DELETE Favorite - Parametrizado, BOLA-safe
app.delete("/api/user/favorites/:componentId", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const { componentId } = req.params;

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

// POST Delete Account - Rule 5.2: Self deletion (requires validation of active session)
app.post("/api/user/delete-account", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.session!.user.id;
    const userEmail = req.session!.user.email;

    // Execute deletion using parameterized prisma adapter
    await prisma.user.delete({
      where: { id: userId }
    });

    // Logging deletion audit event
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

// GET Premium Content
app.get("/api/premium/content", requireSession, requirePremium, generalApiLimiter, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: "Welcome to the Premium Library! This content is fully protected.",
  });
});

// PUT Admin Role Update - RBAC and detailed audit logging
app.put("/api/admin/users/:userId/role", requireSession, requireAdmin, adminLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.userId;

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

// POST Create Subscription (Pix/Boleto/Card)
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

// POST Cancel Active Subscription
app.post("/api/billing/cancel", requireSession, profileLimiter, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await billing.cancelSubscription(req.session!.user.id);
    res.json({ success: true, message: "Subscription cancelled successfully." });
  } catch (err: any) {
    next(err);
  }
});

// POST Upgrade/Downgrade Plan
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

// GET Current Subscription Status
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

// GET Payment Transactions History
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

// POST Inbound Webhook Handler (Uses internal signature and token checking)
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

// ── SAFE GLOBAL ERROR HANDLING MIDDLEWARE ─────────────────────────

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  // Rule 1.3: Redact sensitive Tier 3/4 data from logs
  const redactedError = redactSensitiveData({
    message: err.message,
    stack: err.stack,
    path: req.path,
    query: req.query,
    body: req.body,
  });

  // Log sanitized error trace internally
  console.error(`[ERROR] ${timestamp} | PATH=${req.path} | IP=${getClientIp(req)} | MSG=${redactedError.message}`);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  // Rule 4.1: Clean, customer-safe error response (hide stack trace and internals)
  res.status(err.status || 500).json({
    error: "An unexpected error occurred. Please contact support.",
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

seedPlans().then(() => {
  app.listen(PORT, () => {
    console.log(`[BACKEND SERVER] Running at http://localhost:${PORT}`);
  });
});
