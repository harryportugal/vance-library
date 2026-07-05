import { PrismaClient } from "@prisma/client";
import { PaymentGateway } from "./gateway.interface";
import { AsaasGateway } from "./asaas.gateway";
import { logAuditEvent } from "../audit";

export class BillingEngine {
  private readonly prisma: PrismaClient;
  private readonly gateway: PaymentGateway;
  private readonly webhookToken: string;

  constructor() {
    this.prisma = new PrismaClient();
    // Easily swappable gateway instance for future scalability (SOLID/Clean Architecture)
    this.gateway = new AsaasGateway();
    this.webhookToken = process.env.ASAAS_WEBHOOK_TOKEN || "vance-library-webhook-secret-dev-fallback";

    if (process.env.NODE_ENV === "production" && !process.env.ASAAS_WEBHOOK_TOKEN) {
      console.warn("[Billing Engine] Warning: ASAAS_WEBHOOK_TOKEN is missing in production!");
    }
  }

  /**
   * Safe Billing logger
   */
  private async logBilling(message: string, level: "info" | "warn" | "error", details?: string) {
    try {
      await this.prisma.billingLog.create({
        data: { message, level, details },
      });
      console.log(`[BILLING ${level.toUpperCase()}] ${message} ${details ? `| Details: ${details}` : ""}`);
    } catch (err) {
      console.error("Failed to write billing log to DB:", err);
    }
  }

  /**
   * Orchestrates Subscription Creation for a User
   */
  async createSubscription(params: {
    userId: string;
    planSlug: string;
    billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  }): Promise<{
    subscriptionId: string;
    gatewaySubscriptionId: string;
    invoiceUrl?: string;
    checkoutUrl?: string;
  }> {
    try {
      // 1. Fetch user and check active subscriptions
      const user = await this.prisma.user.findUnique({
        where: { id: params.userId },
        include: { subscriptions: true },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // Check if user already has an active subscription to prevent duplication
      const existingActive = user.subscriptions.find(s => s.status === "ativa");
      if (existingActive) {
        throw new Error("User already has an active subscription.");
      }

      // 2. Fetch plan details
      const plan = await this.prisma.plan.findUnique({
        where: { slug: params.planSlug },
      });

      if (!plan || !plan.ativo) {
        throw new Error(`Plan '${params.planSlug}' is not available or inactive.`);
      }

      // 3. Create or reuse gateway customer ID
      let gatewayCustomerId = user.subscriptions.find(s => s.gateway_customer_id)?.gateway_customer_id;
      if (!gatewayCustomerId) {
        await this.logBilling(`Creating gateway customer for user: ${user.email}`, "info");
        gatewayCustomerId = await this.gateway.createCustomer({
          id: user.id,
          name: user.name,
          email: user.email,
        });
      }

      // 4. Create subscription in Payment Gateway (Asaas)
      const nextDueDate = new Date();
      nextDueDate.setDate(nextDueDate.getDate() + 3); // Due in 3 days

      const cycle = plan.intervalo === "anual" ? "YEARLY" : "MONTHLY";

      await this.logBilling(`Initiating subscription on ${this.gateway.name} for user: ${user.email}`, "info");
      const gatewayResult = await this.gateway.createSubscription({
        gatewayCustomerId,
        value: plan.preco,
        cycle,
        billingType: params.billingType,
        nextDueDate,
        description: `Assinatura Plano ${plan.nome} - Vance Library`,
      });

      // 5. Save subscription to database
      const dbSubscription = await this.prisma.subscription.create({
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

      await this.prisma.transaction.create({
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

      logAuditEvent({
        action: "SIGNUP", // Tracks billing setup initiation
        userId: user.id,
        userEmail: user.email,
        status: "SUCCESS",
        details: `Created billing subscription: ${dbSubscription.id} (Gateway: ${gatewayResult.gatewaySubscriptionId})`,
      });

      return {
        subscriptionId: dbSubscription.id,
        gatewaySubscriptionId: gatewayResult.gatewaySubscriptionId,
        invoiceUrl: gatewayResult.invoiceUrl,
        checkoutUrl: gatewayResult.checkoutUrl,
      };
    } catch (err: any) {
      await this.logBilling(`Subscription creation failed: ${err.message}`, "error", JSON.stringify(params));
      throw err;
    }
  }

  /**
   * Cancels a User's Active Subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const activeSub = await this.prisma.subscription.findFirst({
        where: { user_id: userId, status: "ativa" },
        include: { user: true },
      });

      if (!activeSub) {
        throw new Error("No active subscription found for user.");
      }

      if (!activeSub.gateway_subscription_id) {
        throw new Error("Subscription lacks a valid gateway subscription identifier.");
      }

      await this.logBilling(`Canceling subscription on gateway: ${activeSub.gateway_subscription_id}`, "info");
      await this.gateway.cancelSubscription(activeSub.gateway_subscription_id);

      // Update database locally
      await this.prisma.subscription.update({
        where: { id: activeSub.id },
        data: {
          status: "cancelada",
          cancelada_em: new Date(),
        },
      });

      // Revoke premium access in user table
      await this.prisma.user.update({
        where: { id: userId },
        data: { plan: "free" },
      });

      logAuditEvent({
        action: "ACCOUNT_DELETION", // Maps closest to membership revocation
        userId,
        userEmail: activeSub.user.email,
        status: "SUCCESS",
        details: `Cancelled subscription: ${activeSub.id}`,
      });
    } catch (err: any) {
      await this.logBilling(`Cancellation failed: ${err.message}`, "error", `User: ${userId}`);
      throw err;
    }
  }

  /**
   * Upgrades or Downgrades Subscription Plan
   */
  async changePlan(userId: string, newPlanSlug: string): Promise<void> {
    try {
      const activeSub = await this.prisma.subscription.findFirst({
        where: { user_id: userId, status: "ativa" },
        include: { user: true },
      });

      if (!activeSub) {
        throw new Error("No active subscription found to modify.");
      }

      const newPlan = await this.prisma.plan.findUnique({
        where: { slug: newPlanSlug },
      });

      if (!newPlan || !newPlan.ativo) {
        throw new Error(`Plan '${newPlanSlug}' is unavailable.`);
      }

      await this.logBilling(`Modifying plan values on gateway: ${activeSub.gateway_subscription_id} to amount: ${newPlan.preco}`, "info");
      await this.gateway.updateSubscription(activeSub.gateway_subscription_id!, {
        value: newPlan.preco,
      });

      // Update DB record
      await this.prisma.subscription.update({
        where: { id: activeSub.id },
        data: {
          plano_id: newPlan.id,
        },
      });

      await this.logBilling(`Successfully updated plan to '${newPlanSlug}' for user ${activeSub.user.email}`, "info");
    } catch (err: any) {
      await this.logBilling(`Plan modification failed: ${err.message}`, "error", `User: ${userId}, NewPlan: ${newPlanSlug}`);
      throw err;
    }
  }

  /**
   * Processes Inbound Webhook Payload safely (Idempotent and Authenticated)
   */
  async handleWebhook(payload: any, accessTokenHeader: string | undefined): Promise<void> {
    // 1. Authenticity check
    if (!accessTokenHeader || accessTokenHeader !== this.webhookToken) {
      await this.logBilling("Webhook authentication failed: Invalid or missing token header", "warn");
      throw new Error("Unauthorized Webhook Access");
    }

    const eventId = payload.id;
    const eventType = payload.event;

    if (!eventId || !eventType) {
      throw new Error("Malformed webhook payload structure");
    }

    // 2. Idempotency Check: prevent double processing (replay/duplicity protection)
    const existingEvent = await this.prisma.billingEvent.findUnique({
      where: { gateway_event_id: eventId },
    });

    if (existingEvent) {
      await this.logBilling(`Ignoring duplicate webhook event: ${eventId}`, "info");
      return;
    }

    // Save event payload immediately for tamper-evident record keeping
    await this.prisma.billingEvent.create({
      data: {
        gateway_event_id: eventId,
        event_type: eventType,
        payload: JSON.stringify(payload),
        processed: false,
      },
    });

    try {
      await this.logBilling(`Processing Webhook Event: ${eventType} (ID: ${eventId})`, "info");

      switch (eventType) {
        case "PAYMENT_RECEIVED":
        case "PAYMENT_CONFIRMED": {
          const subscriptionId = payload.payment.subscription;
          const value = payload.payment.value;
          const invoiceUrl = payload.payment.invoiceUrl;
          const invoiceId = payload.payment.id;
          const paymentMethod = payload.payment.billingType;

          if (!subscriptionId) {
            await this.logBilling(`Skipping event ${eventId} - No subscription ID in payment object`, "info");
            break;
          }

          // Find the active/pending subscription locally
          const sub = await this.prisma.subscription.findFirst({
            where: { gateway_subscription_id: subscriptionId },
            include: { user: true, plano: true },
          });

          if (!sub) {
            await this.logBilling(`Local subscription record not found for gateway ID: ${subscriptionId}`, "warn");
            break;
          }

          // Update subscription status to active and calculate next cycle renewal
          const nextDueDate = payload.payment.dueDate 
            ? new Date(payload.payment.dueDate) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await this.prisma.subscription.update({
            where: { id: sub.id },
            data: {
              status: "ativa",
              renovacao: nextDueDate,
            },
          });

          // Set user plan property to premium
          await this.prisma.user.update({
            where: { id: sub.user_id },
            data: { plan: "premium" },
          });

          // Record payment transaction
          await this.prisma.transaction.create({
            data: {
              subscription_id: sub.id,
              user_id: sub.user_id,
              amount: value,
              status: "pago",
              payment_method: paymentMethod,
              gateway_payment_id: invoiceId,
              invoice_url: invoiceUrl,
            },
          });

          logAuditEvent({
            action: "PROFILE_UPDATE", // Plan status modification audit
            userId: sub.user_id,
            userEmail: sub.user.email,
            status: "SUCCESS",
            details: `Subscription activated/paid via webhook: SubID=${sub.id}, PaymentMethod=${paymentMethod}`,
          });

          await this.logBilling(`Subscription ${sub.id} successfully activated for user ${sub.user.email}`, "info");
          break;
        }

        case "PAYMENT_OVERDUE": {
          const subscriptionId = payload.payment.subscription;
          if (!subscriptionId) break;

          const sub = await this.prisma.subscription.findFirst({
            where: { gateway_subscription_id: subscriptionId },
            include: { user: true },
          });

          if (sub) {
            await this.prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "vencida" },
            });

            await this.prisma.user.update({
              where: { id: sub.user_id },
              data: { plan: "free" },
            });

            await this.prisma.transaction.create({
              data: {
                subscription_id: sub.id,
                user_id: sub.user_id,
                amount: payload.payment.value || 0,
                status: "vencido",
                payment_method: payload.payment.billingType || "unknown",
                gateway_payment_id: payload.payment.id,
              },
            });

            await this.logBilling(`Subscription ${sub.id} set to overdue (payment failed) for user ${sub.user.email}`, "warn");
          }
          break;
        }

        case "SUBSCRIPTION_DELETED": {
          const subscriptionId = payload.subscription.id;
          if (!subscriptionId) break;

          const sub = await this.prisma.subscription.findFirst({
            where: { gateway_subscription_id: subscriptionId },
            include: { user: true },
          });

          if (sub) {
            await this.prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "cancelada", cancelada_em: new Date() },
            });

            await this.prisma.user.update({
              where: { id: sub.user_id },
              data: { plan: "free" },
            });

            await this.logBilling(`Subscription ${sub.id} cancelled via gateway webhook for user ${sub.user.email}`, "info");
          }
          break;
        }

        default:
          await this.logBilling(`Unhandled webhook event type received: ${eventType}`, "info");
          break;
      }

      // Mark event as successfully processed
      await this.prisma.billingEvent.update({
        where: { gateway_event_id: eventId },
        data: { processed: true },
      });
    } catch (err: any) {
      await this.logBilling(`Webhook processing error on event ${eventId}: ${err.message}`, "error", JSON.stringify(payload));
      throw err;
    }
  }
}
