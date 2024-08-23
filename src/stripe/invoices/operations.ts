import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { SOLAR_REQUESTS_ID } from "@/server/utils/constants";

export async function getCustomerUpcomingInvoice(ourCustomer: Stripe.Customer) {
    return await stripe.invoices.retrieveUpcoming({ customer: ourCustomer.id });
}

export async function getCustomerCurrentNumberOfRequestsFromInvoice(upcomingInvoice: Stripe.UpcomingInvoice) {
    let numberOfRequests: number = 0;

    upcomingInvoice.lines.data.forEach((line) => {
        const linePricing = line.price;
        const lineQuantity = line.quantity;

        if (linePricing === null || lineQuantity === null) {
            return;
        }

        const productId = linePricing.product as string;
        if (productId === SOLAR_REQUESTS_ID) {
            if (line.unit_amount_excluding_tax !== "0") {
                numberOfRequests = lineQuantity;
            }
        }
    });

    return numberOfRequests;
}
