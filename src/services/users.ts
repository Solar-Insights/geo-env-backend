import {
    getAllTheTeamAdmins,
    getAllTheTeamUsers,
    getUserByEmail,
    createUser,
    removeUserByEmailFromActive,
    getSpecificMemberOfTheTeam
} from "@/db/users/operations";
import { CreateMyOrganizationMemberPayload, CustomAuth0JwtPayload, MyOrganizationMember } from "./types";
import { getTeamById } from "@/db/teams/operations";
import { databaseMemberToClientMember } from "@/dto/users";
import { InsertUser, SupabaseUser } from "@/db/users/types";
import { assignRolesToUser, deleteAuth0User, getManagementAPIToken, manuallyCreateAuth0User, sendEmailForPasswordReset } from "@/api/user";
import { roleIds } from "@/services/constants";

export async function getMyOrganizationDetails(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);

    const myTeam = await getTeamById(requester.team_id);
    const myTeamAdmins = await getAllTheTeamAdmins(requester.team_id);

    const membersDTO: MyOrganizationMember[] = [];
    myTeamAdmins?.forEach((admin) => {
        const singleMemberDTO = databaseMemberToClientMember(admin);
        membersDTO.push(singleMemberDTO);
    });

    return {
        admins: membersDTO,
        name: myTeam.team_name
    };
}

export async function getAllMyOrganizationMembers(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);

    const myTeamMembers = await getAllTheTeamUsers(requester.team_id);

    const membersDTO: MyOrganizationMember[] = [];
    myTeamMembers?.forEach((member) => {
        if (organizationMembersAreIdentical(requester, member)) return;
        const singleMemberDTO = databaseMemberToClientMember(member);
        membersDTO.push(singleMemberDTO);
    });

    return membersDTO;
}

export async function addMemberToMyOrganization(
    decodedAccessToken: CustomAuth0JwtPayload,
    organizationMemberPayload: CreateMyOrganizationMemberPayload
) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);
    const managementAPIToken = await getManagementAPIToken();

    const newUser = await manuallyCreateAuth0User(
        managementAPIToken,
        organizationMemberPayload.email,
        organizationMemberPayload.name
    );
    await sendEmailForPasswordReset(newUser.email);
    await assignRolesToUser(managementAPIToken, newUser.user_id, [roleIds["OrgMember"]]);

    const newMember: InsertUser = {
        auth0_id: newUser.user_id,
        avatar: newUser.picture,
        email: newUser.email,
        name: newUser.nickname,
        team_id: requester.team_id
    };
    await createUser(newMember);

    const newlyCreatedMember = await getUserByEmail(organizationMemberPayload.email);
    const newlyCreatedMemberDTO = databaseMemberToClientMember(newlyCreatedMember);
    return newlyCreatedMemberDTO;
}

export async function deleteMyOrganizationMember(
    decodedAccessToken: CustomAuth0JwtPayload,
    memberToDelete: MyOrganizationMember
) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);
    const managementAPIToken = await getManagementAPIToken();
    const memberToRemove = await getSpecificMemberOfTheTeam(requester.team_id, memberToDelete.email);

    await deleteAuth0User(managementAPIToken, memberToRemove.auth0_id);

    memberToRemove.is_deleted = true;
    await removeUserByEmailFromActive(memberToRemove, memberToRemove.email);
}

function organizationMembersAreIdentical(member1: SupabaseUser, member2: SupabaseUser) {
    return member1.email === member2.email && member1.auth0_id === member2.auth0_id;
}

async function getRequesterFromDecodedAccessToken(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getUserByEmail(decodedAccessToken.email);
    return requester;
}

export async function getOrganizationByAccessToken(decodedAccessToken: CustomAuth0JwtPayload) {
    const requester = await getRequesterFromDecodedAccessToken(decodedAccessToken);

    const organization = await getTeamById(requester.team_id);

    return organization;
}