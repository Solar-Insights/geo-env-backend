import { supabase } from "@/db/init";
import { InsertRequest, UpdateRequest } from "@/db/requests/types";
import { OperationValidator } from "@/db/utils/validator";

export async function getRequestById(id: string) {
    const { data, error } = await supabase.from("requests").select().eq("id", id);

    new OperationValidator(data, error).validateGetSingleOrLessItemRequest();

    return data![0];
}

export async function createRequest(request: InsertRequest) {
    const { data, error } = await supabase.from("requests").insert(request);

    new OperationValidator(data, error).validateCreateRequest();
}

export async function updateRequestById(request: UpdateRequest, id: string) {
    const { data, error } = await supabase.from("requests").update(request).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}
