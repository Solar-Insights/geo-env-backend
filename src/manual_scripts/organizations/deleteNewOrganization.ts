/*
1. npx tsx src/manual_scripts/organizations/deleteNewOrganization.ts
*/

import { UserApi } from "@/api/apis/user";
import { deleteOrganizationById } from "@/db/organizations/operations";

const ORGANIZATION_ID = "229c4f8b-0500-42b0-bae4-0e043a8e6ba1";
const USER_ID = "auth0|66b3a37e7cb478ff787ee908";

// --------------------------------------------

const userApi = new UserApi(undefined as any);
const managementAPIToken = await userApi.getManagementAPIToken();

await deleteOrganizationById(ORGANIZATION_ID);
await userApi.deleteAuth0User(managementAPIToken, USER_ID);
