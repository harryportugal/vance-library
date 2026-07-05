import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { logAuditEvent } from "./audit";

const prisma = new PrismaClient();

// Rule 3.2: Verify secret management is strict in production
if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) {
  console.error("\n==================================================");
  console.error("FATAL: BETTER_AUTH_SECRET is not configured!");
  console.error("The application cannot start in production without a secure secret.");
  console.error("==================================================\n");
  throw new Error("Missing BETTER_AUTH_SECRET environment variable");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  
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
  },
  
  secret: process.env.BETTER_AUTH_SECRET || "vance-library-super-secret-key-32-chars-minimum-dev-fallback",

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
