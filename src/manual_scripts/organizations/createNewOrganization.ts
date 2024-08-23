/*
1. Create Stripe Customer (Company name as Name if org, otherwise full name. If org, put contact person name in Description)
2. npx tsx src/manual_scripts/organizations/createNewOrganization.ts
*/

import { createOrganization, deleteOrganizationById } from "@/db/organizations/operations";
import { InsertOrganization } from "@/db/organizations/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { PricingTier } from "@/server/utils/types";
import { getQuotaByPricingTier } from "@/db/quotas/operations";
import { UserApi } from "@/api/apis/user";
import { addFirstMemberToOrganization } from "@/server/services/users";
import { getCustomerByEmail } from "@/stripe/customers/operations";
import { getProductIds, stripePriceNameToPlanMap } from "@/stripe/utils/constants";
import { createCustomerSubscription } from "@/stripe/subscriptions/operations";
import { getProductPrices } from "@/stripe/products/operations";
import { StripePriceName, StripeProductInfos } from "@/stripe/utils/types";
import { SupabaseUser } from "@/db/users/types";
import { epochTimeToDate } from "@/server/utils/helpers";
import { OrganizationCreationObject } from "../types";

const ORGANIZATION_NAME = "Test org";
const PRICING_TIER: PricingTier = "starter";
const FIRST_USER_EMAIL = "mathisbeaudoin15@hotmail.com";
const FIRST_USER_NAME = "Test contact";
const FIRST_USER_PHONE_NUMBER = "";

// --------------------------------------------

async function createFirstUser(organizationId: string) {
    const userApi = new UserApi(undefined as any);
    return await addFirstMemberToOrganization(userApi, FIRST_USER_EMAIL, FIRST_USER_NAME, organizationId)
}

async function deleteFirstUser(firstUser: SupabaseUser | undefined) {
    if (!firstUser) return;

    const userApi = new UserApi(undefined as any);
    const managementAPIToken = await userApi.getManagementAPIToken();
    await userApi.deleteAuth0User(managementAPIToken, firstUser.auth0_id);
}

async function createProductsPriceIdsObject() {
    const productIds = getProductIds();

    for (const [productName, product] of Object.entries(productIds)) {
        const productPrices = await getProductPrices(product.id);
        productPrices.data.forEach((productPrice) => {
            const planName: StripePriceName = productPrice.nickname as StripePriceName;
            productIds[productName as keyof StripeProductInfos][planName] = productPrice.id;
        })
    }

    return productIds;
}

async function createSubscription() {
    const user = await getCustomerByEmail(FIRST_USER_EMAIL);
    const productPriceIds = await createProductsPriceIdsObject();
    const quotas = await getQuotaByPricingTier(PRICING_TIER);
    return await createCustomerSubscription(user, stripePriceNameToPlanMap[PRICING_TIER], quotas, productPriceIds);
}

const newOrganization: InsertOrganization = {
    contact_email: FIRST_USER_EMAIL,
    contact_name: FIRST_USER_NAME,
    contact_phone_number: FIRST_USER_PHONE_NUMBER,
    customer_id: (await getCustomerByEmail(FIRST_USER_EMAIL)).id,
    id: generateRandomUuid(),
    organization_name: ORGANIZATION_NAME,
    pricing_tier: PRICING_TIER
};

const quotas = await getQuotaByPricingTier(PRICING_TIER);


let firstUser: SupabaseUser | undefined;

try {
    await createOrganization(newOrganization);
    firstUser = await createFirstUser(newOrganization.id)
    const subscription = await createSubscription();

    console.log("\n- NEWLY CREATED STRIPE & SUPABASE ITEMS");
    const organizationCreationObject: OrganizationCreationObject = {
        organizationId: newOrganization.id,
        userId: firstUser.auth0_id,
        subscriptionId: subscription.id
    };
    console.log(`${organizationCreationObject};\n`);
} catch (error) {
    console.log(error);
    console.log(`\nEXECUTING ERROR FALLBACK PROTOCOL\n`);
    await deleteOrganizationById(newOrganization.id);
    await deleteFirstUser(firstUser);
}
