import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";

export async function getUserByAuth0IdAndEmail(auth0Id: string, email: string) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("auth0_id", auth0Id)
        .eq("email", email);

    return { data, error };
}

export async function createUser(user: InsertUser) {
    const { data, error } = await supabase
        .from('users')
        .insert(user);

    return { data, error };
}

export async function updateUserByAuth0Id(user: UpdateUser, auth0Id: string) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq("auth0_id", auth0Id);

    return { data, error };
}

export async function deleteUserByAuth0Id(auth0Id: string) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq("auth0_id", auth0Id);

    return { data, error };
}
