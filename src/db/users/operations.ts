import { supabase } from "@/db/init";
import { InsertUser, UpdateUser } from "@/db/users/types";

export async function selectUserById(id: number) {
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

export async function updateUserById(user: UpdateUser, id: number) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq("id", id);

        return { data, error };
}

export async function deleteUserById(id: number) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq("id", id);

        return { data, error };
}
