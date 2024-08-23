/*
1. npx tsx src/manual_scripts/organizations/deleteNewOrganization.ts
*/

import { UserApi } from "@/api/apis/user";
import { deleteOrganizationById } from "@/db/organizations/operations";
import { deleteCustomerSubscription } from "@/stripe/subscriptions/operations";

const ORGANIZATION_CREATION_OBJECT = {
    organizationId: '89b80a13-f1f7-4124-9127-9a17a9710e66',
    userId: 'auth0|66c90dc7048b91de0386b3df',
    subscriptionId: 'sub_1Pr6172N0m3s9Bb1j6OUFSG8'
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

