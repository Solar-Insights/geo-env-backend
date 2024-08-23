import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { MonthlyQuotaField } from "@/server/utils/types";
import { StripePriceName, StripeProductInfos, StripeProductName } from "@/stripe/utils/types";

type Quotas = {
    [key in MonthlyQuotaField]: number
};

function determineDefaultQuantityForProduct(productName: StripeProductName, quotas: Quotas) {
    switch (productName) {
        case "Plan":
            return 1;
        case "Users":
            return quotas.max_members_count; // Default value that comes from DB
        case "Solar Installation Analysis Requests":
        default:
            return undefined;
    }
}

export async function createCustomerSubscription(ourCustomer: Stripe.Customer, plan: StripePriceName, quotas: Quotas, productInfos: StripeProductInfos) {
    const items: Stripe.SubscriptionCreateParams.Item[] = [];

    Object.entries(productInfos).forEach(([productName, productInfo]) => {
        const priceId = productInfo[plan];
        const quantity = determineDefaultQuantityForProduct(productName as keyof StripeProductInfos, quotas);
        items.push({
            price: priceId,
            quantity: quantity
        });
    });

    return await stripe.subscriptions.create({
        customer: ourCustomer.id,
        currency: "CAD",
        collection_method: "send_invoice",
        days_until_due: 10,
        items: items,
        metadata: quotas
    });
}


export async function deleteCustomerSubscription(subscriptionId: string) {
    stripe.subscriptions.cancel(subscriptionId, {
        invoice_now: false,
        prorate: true
    })
}