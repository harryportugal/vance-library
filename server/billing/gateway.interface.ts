export interface PaymentGateway {
  name: string;

  /**
   * Creates a customer on the payment gateway
   * @returns The gateway-specific customer ID (e.g. cus_...)
   */
  createCustomer(user: {
    id: string;
    name: string;
    email: string;
    cpfCnpj?: string;
    mobilePhone?: string;
  }): Promise<string>;

  /**
   * Creates a recurring subscription for a customer
   */
  createSubscription(params: {
    gatewayCustomerId: string;
    value: number;
    cycle: "WEEKLY" | "MONTHLY" | "YEARLY";
    billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
    nextDueDate: Date;
    description: string;
  }): Promise<{
    gatewaySubscriptionId: string;
    invoiceUrl?: string; // Link to invoice / billing info page
    checkoutUrl?: string; // Direct payment checkout link
    invoiceId?: string; // Gateway specific invoice/payment ID
  }>;

  /**
   * Cancels an active subscription on the gateway
   */
  cancelSubscription(gatewaySubscriptionId: string): Promise<void>;

  /**
   * Updates subscription details (like value/price during upgrade/downgrade)
   */
  updateSubscription(
    gatewaySubscriptionId: string,
    params: {
      value: number;
    }
  ): Promise<void>;
}
