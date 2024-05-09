import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";
import { OperationValidator } from "@/db/operationValidator"; 

export async function getUserByEmail(email: string) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("email", email)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllTheTeamUsers(teamId: string) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("team_id", teamId)
        .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data;
}

export async function getSpecificMemberOfTheTeam(teamId: string, email: string) {
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq("team_id", teamId)
    .eq("email", email)
    .eq("is_deleted", false);

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getAllTheTeamAdmins(teamId: string) {
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq("team_id", teamId)
    .eq("is_deleted", false)
    .eq("is_admin", true);

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data;
}

export async function createUser(user: InsertUser) {
    const { data, error } = await supabase
        .from('users')
        .insert(user);

    new OperationValidator(data, error).validateCreateRequest();
}

export async function updateUserByAuth0Id(user: UpdateUser, email: string) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq("email", email);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function removeUserByEmailFromActive(user: UpdateUser, email: string) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq("email", email);

    new OperationValidator(data, error).validateUpdateRequest();
}

// export async function deleteUserByAuth0Id(auth0Id: string) {
//     const { data, error } = await supabase
//         .from('users')
//         .delete()
//         .eq("auth0_id", auth0Id);

//     new OperationValidator(data, error).validateDeleteRequest();
// }
