import { SupabaseUser } from "@/db/users/types";
import { MyOrganizationMember } from "@/server/utils/types";
import { InsertDeletedUsers } from "@/db/delete_users/types";

export function databaseMemberToClientMember(user: SupabaseUser) {
    const member: MyOrganizationMember = {
        email: user.email,
        avatar: user.avatar,
        created_date: user.created_at,
        name: user.name
    };

    return member;
}

export function databaseMemberToDeletedMember(user: SupabaseUser) {
    const deletedMember: InsertDeletedUsers = {
        auth0_id: user.auth0_id,
        email: user.email
    };

    return deletedMember;
}
