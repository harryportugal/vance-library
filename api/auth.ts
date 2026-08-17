import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { logAuditEvent } from "./audit";

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

  // Custom User fields mappings
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Prevent client-side injection during signup
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false, // Prevent client-side setting of billing tier
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
    requireEmailVerification: false, // SMTP verification ready but optional for dev
    sendResetPassword: async ({ user, url }) => {
      console.log(`\n==================================================`);
      console.log(`[PASSWORD RESET EMAIL]`);
      console.log(`To: ${user.email} (${user.name})`);
      console.log(`Link: ${url}`);
      console.log(`==================================================\n`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`\n==================================================`);
      console.log(`[VERIFICATION EMAIL]`);
      console.log(`To: ${user.email} (${user.name})`);
      console.log(`Link: ${url}`);
      console.log(`==================================================\n`);
    },
  },
  
  // Rule 3.3: Hardened Session Cookies & Expiration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days session lifetime
    updateAge: 60 * 60 * 24,     // Update cookie max-age every 1 day
  },
  
  advanced: {
    cookiePrefix: "vance-auth",
    // Only send cookies over HTTPS in production
    useSecureCookies: process.env.NODE_ENV === "production",
    trustProxy: true,
  },

  // Rule 5.2: Database Hooks for append-only audit trail logging
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          logAuditEvent({
            action: "SIGNUP", // Tracks billing setup initiation
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
            details: "Updated user profile data (name/image)",
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
            details: "Deleted user account from system",
          });
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });
          logAuditEvent({
            action: "LOGIN",
            userId: session.userId,
            userEmail: user?.email || "unknown",
            status: "SUCCESS",
            ipAddress: session.ipAddress || undefined,
            userAgent: session.userAgent || undefined,
            details: "Successful login and session generation",
          });
        },
      },
      delete: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });
          logAuditEvent({
            action: "LOGOUT",
            userId: session.userId,
            userEmail: user?.email || "unknown",
            status: "SUCCESS",
            ipAddress: session.ipAddress || undefined,
            userAgent: session.userAgent || undefined,
            details: "User logged out, session terminated",
          });
        },
      },
    },
    account: {
      update: {
        after: async (account) => {
          const user = await prisma.user.findUnique({
            where: { id: account.userId },
          });
          logAuditEvent({
            action: "PASSWORD_CHANGE",
            userId: account.userId,
            userEmail: user?.email || "unknown",
            status: "SUCCESS",
            details: "User updated their account credentials (password)",
          });
        },
      },
    },
  },
});
