/*
1. npx tsx src/manual_scripts/organizations/deleteNewOrganization.ts
*/

import { UserApi } from "@/api/apis/user";
import { deleteOrganizationById } from "@/db/organizations/operations";
import { deleteCustomerSubscription } from "@/stripe/subscriptions/operations";

const ORGANIZATION_CREATION_OBJECT = {
    organizationId: '818e84bb-57f2-4ff5-85d0-5cd288882074',
    userId: 'auth0|66c9087714891ef799cc9af1',
    subscriptionId: 'sub_1Pr5fA2N0m3s9Bb1QO5oCvZ6'
};

// --------------------------------------------



// --------------------------------------------

const userApi = new UserApi(undefined as any);
const managementAPIToken = await userApi.getManagementAPIToken();

try {
    console.log("\n- DELETING NEWLY CREATED STRIPE & SUPABASE ITEMS");
    await deleteOrganizationById(ORGANIZATION_CREATION_OBJECT.organizationId);
    await userApi.deleteAuth0User(managementAPIToken, ORGANIZATION_CREATION_OBJECT.userId);
    await deleteCustomerSubscription(ORGANIZATION_CREATION_OBJECT.subscriptionId);
} catch (error) {
    console.log(error);
    console.log(`\nCOULD NOT RUN DELETION ON OBJECTS\n`);
}

