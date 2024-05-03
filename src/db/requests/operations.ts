import { supabase } from "@/db/init";
import { InsertRequest, UpdateRequest } from "@/db/requests/types";

export async function selectRequestById(id: number) {
    const { data, error } = await supabase
        .from('requests')
        .select()
        .eq("id", id);
}

export async function createRequest(request: InsertRequest) {
    const { error } = await supabase
        .from('requests')
        .insert(request);
}

export async function updateRequestById(request: UpdateRequest, id: number) {
    const { error } = await supabase
        .from('requests')
        .update(request)
        .eq("id", id);
}

export async function deleteRequestById(id: number) {
    const { error } = await supabase
        .from('requests')
        .delete()
        .eq("id", id);
}
