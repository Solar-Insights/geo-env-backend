/*
1. npx tsx src/manual_scripts/organizations/deleteNewOrganization.ts
*/

import { UserApi } from "@/api/apis/user";
import { deleteOrganizationById } from "@/db/organizations/operations";
import { deleteCustomerSubscription } from "@/stripe/subscriptions/operations";

const ORGANIZATION_CREATION_OBJECT = {
    organizationId: "78cfb07b-42f4-4779-8aa5-faa3b26e071a",
    userId: "auth0|66c9128d45cd9dba24055ecc",
    subscriptionId: "sub_1Pr6Ko2N0m3s9Bb16sDnLBgU"
};

// --------------------------------------------

// --------------------------------------------

const userApi = new UserApi(undefined as any);
const managementAPIToken = await userApi.getManagementAPIToken();

try {
    console.log("\n- DELETING NEWLY CREATED STRIPE & SUPABASE ITEMS\n");
    await deleteOrganizationById(ORGANIZATION_CREATION_OBJECT.organizationId);
    await userApi.deleteAuth0User(managementAPIToken, ORGANIZATION_CREATION_OBJECT.userId);
    await deleteCustomerSubscription(ORGANIZATION_CREATION_OBJECT.subscriptionId);
} catch (error) {
    console.log(error);
    console.log(`\nCOULD NOT RUN DELETION ON OBJECTS\n`);
}
