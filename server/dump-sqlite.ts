import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function dump() {
  console.log("[DUMP] Fetching data from SQLite database...");

  const users = await prisma.user.findMany();
  const plans = await prisma.plan.findMany();
  const subscriptions = await prisma.subscription.findMany();
  const categories = await prisma.category.findMany();
  const components = await prisma.component.findMany();
  const tags = await prisma.tag.findMany();
  const componentTags = await prisma.componentTag.findMany();
  const favorites = await prisma.favorite.findMany();
  const accessLogs = await prisma.accessLog.findMany();
  const transactions = await prisma.transaction.findMany();
  const billingEvents = await prisma.billingEvent.findMany();
  const billingLogs = await prisma.billingLog.findMany();
  const sessions = await prisma.session.findMany();
  const accounts = await prisma.account.findMany();
  const verifications = await prisma.verification.findMany();

  const data = {
    users,
    plans,
    subscriptions,
    categories,
    components,
    tags,
    componentTags,
    favorites,
    accessLogs,
    transactions,
    billingEvents,
    billingLogs,
    sessions,
    accounts,
    verifications,
  };

  const dumpPath = path.join(process.cwd(), "logs", "sqlite_dump.json");
  
  // Ensure logs directory exists
  const logDir = path.dirname(dumpPath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.writeFileSync(dumpPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`[DUMP] SQLite data successfully exported to: ${dumpPath}`);
  console.log(`[DUMP] Stats: Users=${users.length}, Plans=${plans.length}, Subscriptions=${subscriptions.length}, Components=${components.length}, Transactions=${transactions.length}`);
}

dump()
  .catch(err => {
    console.error("[DUMP] Dump process failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
