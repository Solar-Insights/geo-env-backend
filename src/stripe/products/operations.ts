import { stripe } from "@/stripe/init";

export async function getAllProducts() {
    return await stripe.products.list({
        active: true
    });
}

export async function getProductPrices(productId: string) {
    return await stripe.prices.list({
        active: true,
        product: productId
    });
}
