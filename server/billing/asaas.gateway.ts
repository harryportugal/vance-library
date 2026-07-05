import { PaymentGateway } from "./gateway.interface";

export class AsaasGateway implements PaymentGateway {
  public readonly name = "Asaas";
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || "";
    // Sandbox default to avoid side effects during local testing
    this.apiUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";

    if (process.env.NODE_ENV === "production" && !process.env.ASAAS_API_KEY) {
      console.error("[Billing Engine] Warning: ASAAS_API_KEY is missing in production!");
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "access_token": this.apiKey,
    };
  }

  /**
   * Creates customer on Asaas
   */
  async createCustomer(user: {
    id: string;
    name: string;
    email: string;
    cpfCnpj?: string;
    mobilePhone?: string;
  }): Promise<string> {
    try {
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
      if (!data.id) {
        throw new Error("Asaas customer creation response missing 'id'");
      }

      return data.id;
    } catch (error: any) {
      console.error("[AsaasGateway] createCustomer failed:", error.message);
      throw error;
    }
  }

  /**
   * Creates a recurring subscription on Asaas
   */
  async createSubscription(params: {
    gatewayCustomerId: string;
    value: number;
    cycle: "WEEKLY" | "MONTHLY" | "YEARLY";
    billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
    nextDueDate: Date;
    description: string;
  }): Promise<{
    gatewaySubscriptionId: string;
    invoiceUrl?: string;
    checkoutUrl?: string;
    invoiceId?: string;
  }> {
    try {
      // Format date to YYYY-MM-DD
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
      if (!data.id) {
        throw new Error("Asaas subscription creation response missing 'id'");
      }

      return {
        gatewaySubscriptionId: data.id,
        // Invoice page URL or fallback checkout link
        invoiceUrl: data.invoiceUrl || undefined,
        checkoutUrl: data.bankSlipUrl || data.checkoutUrl || undefined,
      };
    } catch (error: any) {
      console.error("[AsaasGateway] createSubscription failed:", error.message);
      throw error;
    }
  }

  /**
   * Cancels a subscription on Asaas
   */
  async cancelSubscription(gatewaySubscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions/${gatewaySubscriptionId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
      }
    } catch (error: any) {
      console.error("[AsaasGateway] cancelSubscription failed:", error.message);
      throw error;
    }
  }

  /**
   * Updates an existing subscription's value (billing plan adjustment)
   */
  async updateSubscription(
    gatewaySubscriptionId: string,
    params: {
      value: number;
    }
  ): Promise<void> {
    try {
      // In Asaas, updating a subscription is done via POST to subscriptions/{id}
      const response = await fetch(`${this.apiUrl}/subscriptions/${gatewaySubscriptionId}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          value: params.value,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Asaas API error (status ${response.status}): ${errorText}`);
      }
    } catch (error: any) {
      console.error("[AsaasGateway] updateSubscription failed:", error.message);
      throw error;
    }
  }
}
