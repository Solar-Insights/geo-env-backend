/*
1. npx tsx src/manual_scripts/test.ts
*/
import { getProductPrices } from "@/stripe/products/operations";
import { getProductIds } from "@/stripe/utils/constants";
import { StripePriceName, StripeProductInfos } from "@/stripe/utils/types";

// const EMAIL = "mathisbeaudoin15@hotmail.com"
// const customer = await getCustomerByEmail(EMAIL);
// const invoice = await getCustomerUpcomingInvoice(customer);
// console.log(invoice)

async function createProductsPriceIdsObject() {
    const productIds = getProductIds();

    for (const [productName, product] of Object.entries(productIds)) {
        const productPrices = await getProductPrices(product.id);
        productPrices.data.forEach((productPrice) => {
            const planName: StripePriceName = productPrice.nickname as StripePriceName;
            console.log(planName)
            productIds[productName as keyof StripeProductInfos][planName] = productPrice.id;
        })
    }

    return productIds;
}

console.log(await createProductsPriceIdsObject())