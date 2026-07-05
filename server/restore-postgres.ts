import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Initialize PostgreSQL client (it will use the DATABASE_URL environment variable)
const prisma = new PrismaClient();

const dumpPath = path.join(process.cwd(), "logs", "sqlite_dump.json");

async function restore() {
  console.log("[RESTORE] Starting database restoration from SQLite dump...");

  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dump file not found at: ${dumpPath}. Run 'npx tsx server/dump-sqlite.ts' first.`);
  }

  const rawData = fs.readFileSync(dumpPath, "utf8");
  const data = JSON.parse(rawData);

  console.log("[RESTORE] SQLite dump loaded successfully. Parsing records...");

  // Conversion helper to parse ISO strings back to Date objects
  const toDate = (val: any) => (val ? new Date(val) : null);

  // 1. Restore Plans (Independent)
  if (data.plans && data.plans.length > 0) {
    console.log(`[RESTORE] Restoring ${data.plans.length} plans...`);
    for (const plan of data.plans) {
      await prisma.plan.upsert({
        where: { id: plan.id },
        update: {},
        create: {
          id: plan.id,
          nome: plan.nome,
          slug: plan.slug,
          descricao: plan.descricao,
          preco: plan.preco,
          moeda: plan.moeda,
          intervalo: plan.intervalo,
          ativo: plan.ativo,
          created_at: toDate(plan.created_at) || new Date(),
        },
      });
    }
  }

  // 2. Restore Users (Independent)
  if (data.users && data.users.length > 0) {
    console.log(`[RESTORE] Restoring ${data.users.length} users...`);
    for (const user of data.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          status: user.status,
          plan: user.plan || "free",
          createdAt: toDate(user.createdAt) || new Date(),
          updatedAt: toDate(user.updatedAt) || new Date(),
        },
      });
    }
  }

  // 3. Restore Categories (Independent)
  if (data.categories && data.categories.length > 0) {
    console.log(`[RESTORE] Restoring ${data.categories.length} categories...`);
    for (const cat of data.categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: {},
        create: {
          id: cat.id,
          nome: cat.nome,
          slug: cat.slug,
          descricao: cat.descricao,
          ordem: cat.ordem,
          created_at: toDate(cat.created_at) || new Date(),
        },
      });
    }
  }

  // 4. Restore Tags (Independent)
  if (data.tags && data.tags.length > 0) {
    console.log(`[RESTORE] Restoring ${data.tags.length} tags...`);
    for (const tag of data.tags) {
      await prisma.tag.upsert({
        where: { id: tag.id },
        update: {},
        create: {
          id: tag.id,
          nome: tag.nome,
          slug: tag.slug,
        },
      });
    }
  }

  // 5. Restore Subscriptions (Depends on Users & Plans)
  if (data.subscriptions && data.subscriptions.length > 0) {
    console.log(`[RESTORE] Restoring ${data.subscriptions.length} subscriptions...`);
    for (const sub of data.subscriptions) {
      await prisma.subscription.upsert({
        where: { id: sub.id },
        update: {},
        create: {
          id: sub.id,
          user_id: sub.user_id,
          plano_id: sub.plano_id,
          gateway_customer_id: sub.gateway_customer_id,
          gateway_subscription_id: sub.gateway_subscription_id,
          status: sub.status,
          inicio: toDate(sub.inicio) || new Date(),
          fim: toDate(sub.fim),
          renovacao: toDate(sub.renovacao),
          cancelada_em: toDate(sub.cancelada_em),
          created_at: toDate(sub.created_at) || new Date(),
          updated_at: toDate(sub.updated_at) || new Date(),
        },
      });
    }
  }

  // 6. Restore Components (Depends on Categories)
  if (data.components && data.components.length > 0) {
    console.log(`[RESTORE] Restoring ${data.components.length} components...`);
    for (const comp of data.components) {
      await prisma.component.upsert({
        where: { id: comp.id },
        update: {},
        create: {
          id: comp.id,
          titulo: comp.titulo,
          slug: comp.slug,
          descricao: comp.descricao,
          categoria_id: comp.categoria_id,
          premium: comp.premium,
          preview_image: comp.preview_image,
          preview_video: comp.preview_video,
          codigo: comp.codigo,
          documentacao: comp.documentacao,
          instalacao: comp.instalacao,
          dependencias: comp.dependencias,
          nivel_de_dificuldade: comp.nivel_de_dificuldade,
          created_at: toDate(comp.created_at) || new Date(),
          updated_at: toDate(comp.updated_at) || new Date(),
        },
      });
    }
  }

  // 7. Restore ComponentTags (Depends on Components & Tags)
  if (data.componentTags && data.componentTags.length > 0) {
    console.log(`[RESTORE] Restoring ${data.componentTags.length} component-tag relations...`);
    for (const ct of data.componentTags) {
      await prisma.componentTag.upsert({
        where: {
          component_id_tag_id: {
            component_id: ct.component_id,
            tag_id: ct.tag_id,
          },
        },
        update: {},
        create: {
          component_id: ct.component_id,
          tag_id: ct.tag_id,
        },
      });
    }
  }

  // 8. Restore Favorites (Depends on Users & Components)
  if (data.favorites && data.favorites.length > 0) {
    console.log(`[RESTORE] Restoring ${data.favorites.length} user favorites...`);
    for (const fav of data.favorites) {
      await prisma.favorite.upsert({
        where: { id: fav.id },
        update: {},
        create: {
          id: fav.id,
          user_id: fav.user_id,
          component_id: fav.component_id,
          created_at: toDate(fav.created_at) || new Date(),
        },
      });
    }
  }

  // 9. Restore AccessLogs (Depends on Users & Components)
  if (data.accessLogs && data.accessLogs.length > 0) {
    console.log(`[RESTORE] Restoring ${data.accessLogs.length} access logs...`);
    for (const log of data.accessLogs) {
      await prisma.accessLog.upsert({
        where: { id: log.id },
        update: {},
        create: {
          id: log.id,
          user_id: log.user_id,
          component_id: log.component_id,
          created_at: toDate(log.created_at) || new Date(),
        },
      });
    }
  }

  // 10. Restore Transactions (Depends on Users & Subscriptions)
  if (data.transactions && data.transactions.length > 0) {
    console.log(`[RESTORE] Restoring ${data.transactions.length} transactions...`);
    for (const tx of data.transactions) {
      await prisma.transaction.upsert({
        where: { id: tx.id },
        update: {},
        create: {
          id: tx.id,
          subscription_id: tx.subscription_id,
          user_id: tx.user_id,
          amount: tx.amount,
          status: tx.status,
          payment_method: tx.payment_method,
          gateway_payment_id: tx.gateway_payment_id,
          invoice_url: tx.invoice_url,
          created_at: toDate(tx.created_at) || new Date(),
        },
      });
    }
  }

  // 11. Restore BillingEvents (Independent)
  if (data.billingEvents && data.billingEvents.length > 0) {
    console.log(`[RESTORE] Restoring ${data.billingEvents.length} billing events...`);
    for (const ev of data.billingEvents) {
      await prisma.billingEvent.upsert({
        where: { id: ev.id },
        update: {},
        create: {
          id: ev.id,
          gateway_event_id: ev.gateway_event_id,
          event_type: ev.event_type,
          payload: ev.payload,
          processed: ev.processed,
          created_at: toDate(ev.created_at) || new Date(),
        },
      });
    }
  }

  // 12. Restore BillingLogs (Independent)
  if (data.billingLogs && data.billingLogs.length > 0) {
    console.log(`[RESTORE] Restoring ${data.billingLogs.length} billing logs...`);
    for (const bl of data.billingLogs) {
      await prisma.billingLog.upsert({
        where: { id: bl.id },
        update: {},
        create: {
          id: bl.id,
          message: bl.message,
          level: bl.level,
          details: bl.details,
          created_at: toDate(bl.created_at) || new Date(),
        },
      });
    }
  }

  // 13. Restore Sessions (Depends on Users)
  if (data.sessions && data.sessions.length > 0) {
    console.log(`[RESTORE] Restoring ${data.sessions.length} sessions...`);
    for (const sess of data.sessions) {
      await prisma.session.upsert({
        where: { id: sess.id },
        update: {},
        create: {
          id: sess.id,
          userId: sess.userId,
          token: sess.token,
          expiresAt: toDate(sess.expiresAt) || new Date(),
          ipAddress: sess.ipAddress,
          userAgent: sess.userAgent,
          createdAt: toDate(sess.createdAt) || new Date(),
          updatedAt: toDate(sess.updatedAt) || new Date(),
        },
      });
    }
  }

  // 14. Restore Accounts (Depends on Users)
  if (data.accounts && data.accounts.length > 0) {
    console.log(`[RESTORE] Restoring ${data.accounts.length} accounts...`);
    for (const acc of data.accounts) {
      await prisma.account.upsert({
        where: { id: acc.id },
        update: {},
        create: {
          id: acc.id,
          userId: acc.userId,
          accountId: acc.accountId,
          providerId: acc.providerId,
          password: acc.password,
          accessToken: acc.accessToken,
          refreshToken: acc.refreshToken,
          idToken: acc.idToken,
          expiresAt: toDate(acc.expiresAt),
          passwordExpiredAt: toDate(acc.passwordExpiredAt),
          scope: acc.scope,
          createdAt: toDate(acc.createdAt) || new Date(),
          updatedAt: toDate(acc.updatedAt) || new Date(),
        },
      });
    }
  }

  // 15. Restore Verifications (Independent)
  if (data.verifications && data.verifications.length > 0) {
    console.log(`[RESTORE] Restoring ${data.verifications.length} verifications...`);
    for (const ver of data.verifications) {
      await prisma.verification.upsert({
        where: { id: ver.id },
        update: {},
        create: {
          id: ver.id,
          identifier: ver.identifier,
          value: ver.value,
          expiresAt: toDate(ver.expiresAt) || new Date(),
          createdAt: toDate(ver.createdAt),
          updatedAt: toDate(ver.updatedAt),
        },
      });
    }
  }

  console.log("[RESTORE] Database successfully restored on PostgreSQL!");
}

restore()
  .catch(err => {
    console.error("[RESTORE] Restoration failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
