import { SupabaseUser } from "@/db/users/types";
import { MyOrganizationMember } from "@/services/types";

export function databaseMemberToClientMember(user: SupabaseUser) {
    const member: MyOrganizationMember = {
        email: user.email,
        avatar: user.avatar,
        created_date: user.created_at,
        name: user.name,
    }
    
    return member;
}