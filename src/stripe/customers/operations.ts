import { stripe } from "@/stripe/init";

export async function getCustomerByEmail(email: string) {
    const customers = await stripe.customers.list({
        email: email,
        limit: 1
    });

    const data = customers.data;

    if (data.length != 1) throw new Error();
    return data[0];
}
