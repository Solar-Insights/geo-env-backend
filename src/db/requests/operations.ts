import { supabase } from "@/db/init";
import { InsertRequest, UpdateRequest } from "@/db/requests/types";
import { OperationValidator } from "@/db/operationValidator"; 

export async function getRequestById(id: string) {
    const { data, error } = await supabase
        .from('requests')
        .select()
        .eq("id", id);

    new OperationValidator(data, error).validateGetSingleItemRequest(); 

    return { data, error };
}

export async function createRequest(request: InsertRequest) {
    const { data, error } = await supabase
        .from('requests')
        .insert(request);

    new OperationValidator(data, error).validateCreateRequest();

    return { data, error };
}

export async function updateRequestById(request: UpdateRequest, id: string) {
    const { data, error } = await supabase
        .from('requests')
        .update(request)
        .eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();

    return { data, error };
}

export async function deleteRequestById(id: string) {
    const { data, error } = await supabase
        .from('requests')
        .delete()
        .eq("id", id);

    new OperationValidator(data, error).validateDeleteRequest();

    return { data, error };
}
