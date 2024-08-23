import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { MonthlyQuotaField } from "@/server/utils/types";

type Quotas = {
    [key in MonthlyQuotaField]: number
};

export async function createCustomerSubscription(ourCustomer: Stripe.Customer, quotas: Quotas) {
    const subscription = await stripe.subscriptions.create({
        customer: ourCustomer.id,
        currency: "CAD",
        //collection_method: "send_invoice",
        days_until_due: 10,
        items: [
            {
                price: 'price_1MowQULkdIwHu7ixraBm864M',
            },
        ],
        metadata: quotas
    });
}
