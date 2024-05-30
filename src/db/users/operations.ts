import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";
import { OperationValidator } from "@/db/operationValidator";

export async function getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select().eq("email", email).eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllTheTeamUsers(teamId: string) {
    const { data, error } = await supabase.from("users").select().eq("team_id", teamId).eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data;
}

export async function getTeamUserCount(teamId: string) {
    const { count, error } = await supabase.from("users")
        .select("*", { count: "exact", head: true })
        .eq("team_id", teamId)
        .eq("is_deleted", false)

    new OperationValidator(null, error, count).validateCountRequest();

    return count!;
}

export async function getSpecificMemberOfTheTeam(teamId: string, email: string) {
    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("team_id", teamId)
        .eq("email", email)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllTheTeamAdmins(teamId: string) {
    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("team_id", teamId)
        .eq("is_admin", true)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data;
}

export async function createUser(user: InsertUser) {
    const { data, error } = await supabase.from("users").insert(user);

    new OperationValidator(data, error).validateCreateRequest();
}

export async function updateUserByAuth0Id(user: UpdateUser, email: string) {
    const { data, error } = await supabase.from("users").update(user).eq("email", email);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function removeUserByEmailFromActive(user: UpdateUser, email: string) {
    const { data, error } = await supabase
        .from("users")
        .update(user)
        .eq("email", email);

    new OperationValidator(data, error).validateUpdateRequest();
}
