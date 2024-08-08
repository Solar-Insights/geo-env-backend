import { stripe } from "@/stripe/init";
import Stripe from "stripe";
import { StripeCustomerError } from "@/stripe/errors";

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
