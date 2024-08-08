/*
1. npx tsx src/manual_scripts/test.ts
*/

import { getMyOrganizationBillingRecap } from "@/server/services/users"

console.log(await getMyOrganizationBillingRecap({
    "organization_id": "229c4f8b-0500-42b0-bae4-0e043a8e6ba1" 
} as any))