/*
    - Run using:
    npx tsx src/db/test.ts
*/
import { createOrganization, getOrganizationById } from "@/db/organizations/operations";
import { createUser, getUserByEmail } from "@/db/users/operations";

const userId = "2m5fiinQSDYS5Zvw1K5SWJjGkKUSgANi";
const userEmail = "mathisbeaudoin15@hotmail.com";
const organizationId = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imc5dTZaYUdJbkk0YUM5bFpwMkM0UiJ9";

await createOrganization({
    id: organizationId,
    organization_name: "test",
    contact_email: "mathis.beaudoin@protonmail.com",
    contact_phone_number: "418 255-7097",
    contact_name: "Admin"
});

await createUser({
    auth0_id: userId,
    email: userEmail,
    name: "Testeur",
    organization_id: organizationId
});

const user = await getUserByEmail(userEmail);
console.log(user);

const organization = await getOrganizationById(organizationId);
console.log(organization);

/**
    Billing date should be set on creation of a organization. 
    - Is the same numerical day as the as the creation date of the organization
    - If number is not below 28 (29-30-31) then changes it to the 1st of every month to avoid problems
*/
