import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";
import { OperationValidator } from "@/db/utils/validator";

export async function getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select().eq("email", email).eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllOrganizationUsers(organizationId: string) {
    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("organization_id", organizationId)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data!;
}

export async function getOrganizationUserCount(organizationId: string) {
    const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("is_deleted", false);

    new OperationValidator(null, error, count).validateCountRequest();

    return count!;
}

export async function getSpecificMemberOfTheOrganization(organizationId: string, email: string) {
    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("organization_id", organizationId)
        .eq("email", email)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllTheOrganizationAdmins(organizationId: string) {
    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("organization_id", organizationId)
        .eq("is_admin", true)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data!;
}

export async function createUser(user: InsertUser) {
    const { data, error } = await supabase.from("users").insert(user).select();

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function updateUserByAuth0Id(user: UpdateUser, email: string) {
    const { data, error } = await supabase.from("users").update(user).eq("email", email).eq("is_delete", false);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function removeUserByEmailFromActive(user: UpdateUser, email: string) {
    const { data, error } = await supabase.from("users").update(user).eq("email", email).eq("is_deleted", false);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function deleteUserById(id: string) {
    const { data, error } = await supabase.from("users").delete().eq("id", id)

    new OperationValidator(data, error).validateDeleteRequest();
}
