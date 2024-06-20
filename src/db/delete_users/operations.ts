import { InsertDeletedUsers } from "@/db/delete_users/types";
import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/utils/validator";

export async function createDeletedUser(user: InsertDeletedUsers) {
    const { data, error } = await supabase.from("deleted_users").insert(user).select();

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}
