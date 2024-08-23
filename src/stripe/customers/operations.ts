import { stripe } from "@/stripe/init";
import { StripeCustomerError } from "@/stripe/errors";

export async function getCustomerById(id: string) {
    const customer = await stripe.customers.retrieve(id);
    if (customer.deleted) {
        throw new StripeCustomerError(`Expected to find a non-deleted customer with the following id: ${id}`);
    }

    return customer;
}

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
