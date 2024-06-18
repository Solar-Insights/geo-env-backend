import {
    getAllTheOrganizationAdmins,
    getAllOrganizationUsers,
    createUser,
    removeUserByEmailFromActive,
    getSpecificMemberOfTheOrganization
} from "@/db/users/operations";
import { CreateMyOrganizationMemberPayload, CustomAuth0JwtPayload, MyOrganizationBillingRecap, MyOrganizationMember } from "@/server/utils/types";
import { getOrganizationById } from "@/db/organizations/operations";
import { databaseMemberToClientMember, databaseMemberToDeletedMember } from "@/dto/users/users";
import { InsertUser, SupabaseUser } from "@/db/users/types";
import { UserApi } from "@/api/apis/user";
import { roleIds } from "@/server/utils/constants";
import { getRequesterFromDecodedAccessToken, organizationMembersAreIdentical } from "@/db/users/helpers";
import { decrementLatestBillingField, getLatestBillingByOrganizationId } from "@/db/billing/operations";
import { createDeletedUser } from "@/db/delete_users/operations";

export async function getMyOrganizationDetails(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);

    const myOrganization = await getOrganizationById(requester.organization_id);
    const myOrganizationAdmins = await getAllTheOrganizationAdmins(requester.organization_id);

    const membersDTO: MyOrganizationMember[] = [];
    myOrganizationAdmins?.forEach((admin) => {
        const singleMemberDTO = databaseMemberToClientMember(admin);
        membersDTO.push(singleMemberDTO);
    });

    return {
        admins: membersDTO,
        name: myOrganization.organization_name
    };
}

export async function getMyOrganizationAdminDetails(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester: SupabaseUser = await getRequesterFromDecodedAccessToken(decodedAccessToken);
    const myOrganizationMembers: MyOrganizationMember[] = await getAllMyOrganizationMembers(requester);
    const myOrganizationBillingRecap: MyOrganizationBillingRecap = await getMyOrganizationBillingRecap(requester);

    return {
        myOrganizationMembers: myOrganizationMembers,
        myOrganizationBillingRecap: myOrganizationBillingRecap
    }
}

async function getAllMyOrganizationMembers(requester: SupabaseUser) {
    const myOrganizationMembers = await getAllOrganizationUsers(requester.organization_id);

    const membersDTO: MyOrganizationMember[] = [];
    myOrganizationMembers.forEach((member) => {
        const singleMemberDTO = databaseMemberToClientMember(member);
        membersDTO.push(singleMemberDTO);
    });

    return membersDTO;
}

async function getMyOrganizationBillingRecap(requester: SupabaseUser) : Promise<MyOrganizationBillingRecap> {
    const latestBilling = await getLatestBillingByOrganizationId(requester.organization_id);
    const org = await getOrganizationById(requester.organization_id);
    
    return {
        building_insights_requests: latestBilling.building_insights_requests,
        max_building_insights_requests: latestBilling.max_building_insights_requests,
        max_free_building_insights_requests: latestBilling.max_free_building_insights_requests,
        members_count: latestBilling.members_count,
        max_members_count: latestBilling.max_members_count,
        max_free_members_count: latestBilling.max_free_members_count,
        pricingTier: org.pricing_tier,
        billingDate: latestBilling.billing_date
    };
}

export async function addMemberToMyOrganization(
    userApi: UserApi,
    decodedAccessToken: CustomAuth0JwtPayload,
    organizationMemberPayload: CreateMyOrganizationMemberPayload
) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);
    const managementAPIToken = await userApi.getManagementAPIToken();

    const newUser = await userApi.manuallyCreateAuth0User(
        managementAPIToken,
        organizationMemberPayload.email,
        organizationMemberPayload.name
    );
    await userApi.sendEmailForPasswordReset(newUser.email);
    await userApi.assignRolesToUser(managementAPIToken, newUser.user_id, [roleIds["OrgMember"]]);

    const newMember: InsertUser = {
        auth0_id: newUser.user_id,
        avatar: newUser.picture,
        email: newUser.email,
        name: newUser.nickname,
        organization_id: requester.organization_id
    };
    
    const newlyCreatedMember = await createUser(newMember);

    const newlyCreatedMemberDTO = databaseMemberToClientMember(newlyCreatedMember);
    return newlyCreatedMemberDTO;
}

export async function deleteMyOrganizationMember(
    userApi: UserApi,
    decodedAccessToken: CustomAuth0JwtPayload,
    memberToDelete: MyOrganizationMember
) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);
    const managementAPIToken = await userApi.getManagementAPIToken();
    const memberToRemove = await getSpecificMemberOfTheOrganization(requester.organization_id, memberToDelete.email);

    if (organizationMembersAreIdentical(requester, memberToRemove)) return;

    await userApi.deleteAuth0User(managementAPIToken, memberToRemove.auth0_id);

    memberToRemove.is_deleted = true;
    await removeUserByEmailFromActive(memberToRemove, memberToRemove.email);
    await decrementLatestBillingField(requester.organization_id, "members_count");
    await createDeletedUser(databaseMemberToDeletedMember(memberToRemove));
}
