/*
1. Create Stripe Customer
2. Add Products to Stripe Customer 
3. Run: npx tsx src/manual_scripts/createNewOrganization.ts
*/

import { createOrganization } from "@/db/organizations/operations";
import { createBilling } from "@/db/billing/operations";
import { InsertOrganization } from "@/db/organizations/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { CreateMyOrganizationMemberPayload, CustomAuth0JwtPayload, PricingTier } from "@/server/utils/types";
import { InsertBilling } from "@/db/billing/types";
import { SOLAR_INSIGHTS_INFINITY } from "@/server/utils/constants";
import { UserApi } from "@/api/apis/user";
import { addMemberToMyOrganization } from "@/server/services/users";
import { getCustomerByEmail } from "@/stripe/customers/operations";

const ORGANIZATION_NAME = "";
const PRICING_TIER: PricingTier = "starter";
const FIRST_USER_EMAIL = "";
const FIRST_USER_NAME = "";
const FIRST_USER_PHONE_NUMBER = "";

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

async function createFirstUser() {
    const userApi = new UserApi(undefined as any);
    const body: CreateMyOrganizationMemberPayload = {
        email: FIRST_USER_EMAIL,
        name: FIRST_USER_NAME
    };
    const decodedAccessToken: CustomAuth0JwtPayload = {
        permissions: "",
        email: FIRST_USER_EMAIL,
        azp: ""
    };

    await addMemberToMyOrganization(
        userApi,
        decodedAccessToken,
        body
    );
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
    building_insights_requests: 0,
    max_building_insights_requests: pricingTierToMaxBuildingInsightsRequests(PRICING_TIER),
    max_free_building_insights_requests: 0,
    members_count: 1,
    max_members_count: pricingTierToMaxFreeMembersCount(PRICING_TIER),
    max_free_members_count: pricingTierToMaxFreeMembersCount(PRICING_TIER),
    organization_id: newOrganization.id,
    billing_date: new Date().toISOString().substring(0, 10)
};

await createOrganization(newOrganization);
await createBilling(firstBilling);
await createFirstUser();
