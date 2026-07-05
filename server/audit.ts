import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

// Ensure logs directory exists safely
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create log directory:", err);
}

const auditLogPath = path.join(logDir, "audit.log");

// Rule 5.1: Sanitize input to prevent Log Injection (CWE-117)
// Strip carriage return and newline characters to prevent log forging
function sanitizeForLogs(str: string): string {
  if (!str) return "";
  return str.replace(/[\r\n]+/g, " ").trim();
}

// Rule 1.3: Redact sensitive Tier 3/4 data (passwords, tokens, cookies, secrets)
export function redactSensitiveData(data: any): any {
  if (!data) return data;
  if (typeof data !== "object") return data;

  const sensitiveKeys = [
    "password",
    "senha",
    "token",
    "cookie",
    "secret",
    "hash",
    "apiKey",
    "key",
    "newPassword",
    "currentPassword",
    "authorization",
    "accessToken",
    "refreshToken",
    "idToken"
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

// Tamper-resistant log writer
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

  const logLine = JSON.stringify(entry) + "\n";

  try {
    fs.appendFileSync(auditLogPath, logLine, "utf8");
  } catch (err) {
    console.error("Failed to write to audit log:", err);
  }

  // Safe console log for container monitoring (structured for production logs)
  console.log(`[AUDIT] ${timestamp} | ACTION=${entry.action} | USER=${entry.userEmail} | STATUS=${entry.status} | IP=${entry.ipAddress}`);
}
