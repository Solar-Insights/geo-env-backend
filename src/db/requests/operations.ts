import { supabase } from "@/db/init";
import { InsertRequest, UpdateRequest } from "@/db/requests/types";

export async function getRequestById(id: number) {
    const { data, error } = await supabase
        .from('requests')
        .select()
        .eq("id", id);

    return { data, error };
}

export async function createRequest(request: InsertRequest) {
    const { data, error } = await supabase
        .from('requests')
        .insert(request);

    return { data, error };
}

export async function updateRequestById(request: UpdateRequest, id: number) {
    const { data, error } = await supabase
        .from('requests')
        .update(request)
        .eq("id", id);

    return { data, error };
}

export async function deleteRequestById(id: number) {
    const { data, error } = await supabase
        .from('requests')
        .delete()
        .eq("id", id);

    return { data, error };
}
