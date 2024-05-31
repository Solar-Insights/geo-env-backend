import { getOrganizationById } from "@/db/organizations/operations";
import { getUserByEmail } from "@/db/users/operations";
import { CustomAuth0JwtPayload } from "@/server/utils/types";
import { SupabaseUser } from "@/db/users/types";

export function organizationMembersAreIdentical(member1: SupabaseUser, member2: SupabaseUser) {
    return member1.email === member2.email && member1.auth0_id === member2.auth0_id;
}

export async function getRequesterFromDecodedAccessToken(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getUserByEmail(decodedAccessToken.email);
    return requester;
}

export async function getOrganizationByAccessToken(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);

    const organization = await getOrganizationById(requester.organization_id);

    return organization;
}