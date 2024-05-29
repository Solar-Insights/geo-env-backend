import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/operationValidator";

export async function getLatestBillingByTeamId(teamId: string) {
    const { data, error } = await supabase.from("billing")
        .select()
        .eq("id", teamId)
        .order("billing_date", { ascending: false });

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}
