import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { MonthlyQuotaField } from "@/server/utils/types";
import { StripePriceName, StripeProductInfos } from "@/stripe/utils/types";

type Quotas = {
    [key in MonthlyQuotaField]: number
};  

export async function createCustomerSubscription(ourCustomer: Stripe.Customer, plan: StripePriceName, quotas: Quotas, productInfos: StripeProductInfos) {
    const items: Stripe.SubscriptionCreateParams.Item[] = [];

    Object.values(productInfos).forEach((productInfo) => {
        const priceId = productInfo[plan];
        items.push({
            price: priceId
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