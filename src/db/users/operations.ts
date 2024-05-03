import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";

export async function getUserById(id: number) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("id", id);

        return { data, error };
}

export async function createUser(user: InsertUser) {
    const { data, error } = await supabase
        .from('users')
        .insert(user);

    return { data, error };
}

export async function updateUserByAuth0Id(user: UpdateUser, auth0Id: number) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq("auth0_id", auth0Id);

        return { data, error };
}

export async function deleteUserByAuth0Id(auth0Id: number) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq("auth0_id", auth0Id);

        return { data, error };
}
