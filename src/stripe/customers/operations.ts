import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { StripeCustomerError } from "@/stripe/errors";
import { SOLAR_REQUESTS_ID } from "@/server/utils/constants";

export async function getCustomerByEmail(email: string) {
    const customers = await stripe.customers.list({
        email: email,
        limit: 1
    });
    
    if (customers.data.length != 1) {
        throw new StripeCustomerError(`Expected to find a customer with the following email: ${email}.`);
    }

    return customers.data[0];
}

export async function getCustomerUpcomingInvoice(ourCustomer: Stripe.Customer) {
    return await stripe.invoices.retrieveUpcoming({ customer: ourCustomer.id })
}

export async function getCustomerCurrentNumberOfRequests(ourCustomer: Stripe.Customer) {
    const upcomingInvoice = await getCustomerUpcomingInvoice(ourCustomer);

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