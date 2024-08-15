/*
1. Create Stripe Customer (Company name as Name if org, otherwise full name. If org, put contact person name in Description)
2. Create Subscription with products for new Customer
3. npx tsx src/manual_scripts/organizations/createNewOrganization.ts
*/

import { createOrganization, deleteOrganizationById } from "@/db/organizations/operations";
import { createBilling, deleteBillingById } from "@/db/billing/operations";
import { InsertOrganization } from "@/db/organizations/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { PricingTier } from "@/server/utils/types";
import { InsertBilling } from "@/db/billing/types";
import { SOLAR_INSIGHTS_INFINITY } from "@/server/utils/constants";
import { UserApi } from "@/api/apis/user";
import { addFirstMemberToOrganization } from "@/server/services/users";
import { getCustomerByEmail } from "@/stripe/customers/operations";

const ORGANIZATION_NAME = "Test org";
const PRICING_TIER: PricingTier = "starter";
const FIRST_USER_EMAIL = "mathisbeaudoin15@hotmail.com";
const FIRST_USER_NAME = "Test contact";
const FIRST_USER_PHONE_NUMBER = "";

// --------------------------------------------

function pricingTierToMaxBuildingInsightsRequests(pricingTier: PricingTier) {
    switch (pricingTier) {
        case "starter":
            return 100;
        case "pro":
            return SOLAR_INSIGHTS_INFINITY;
        case "enterprise":
            return SOLAR_INSIGHTS_INFINITY;
    }
}

function pricingTierToMaxFreeMembersCount(pricingTier: PricingTier) {
    switch (pricingTier) {
        case "starter":
            return 1;
        case "pro":
            return 4;
        case "enterprise":
            return 8;
    }
}

// --------------------------------------------

async function createFirstUser(organizationId: string) {
    const userApi = new UserApi(undefined as any);
    return await addFirstMemberToOrganization(userApi, FIRST_USER_EMAIL, FIRST_USER_NAME, organizationId)
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

const firstBilling: InsertBilling = {
    id: generateRandomUuid(),
    max_building_insights_requests: pricingTierToMaxBuildingInsightsRequests(PRICING_TIER),
    max_members_count: pricingTierToMaxFreeMembersCount(PRICING_TIER),
    organization_id: newOrganization.id,
    billing_date: new Date().toISOString().substring(0, 10)
};

try {
    await createOrganization(newOrganization);
    await createBilling(firstBilling);
    const firstUser = await createFirstUser(newOrganization.id)
    console.log(`\n- NEW ORGANIZATION WITH ID:\n${newOrganization.id}\n`);
    console.log(`\n- NEW USER WITH ID:\n${firstUser.auth0_id}\n`)
} catch (error) {
    console.log(error);
    await deleteOrganizationById(newOrganization.id);
    await deleteBillingById(firstBilling.id);
}
