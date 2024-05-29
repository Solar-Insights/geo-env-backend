import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/operationValidator";
import { MonthlyBillingField, MonthlyQuotaField } from "@/services/types";
import { SupabaseBilling, UpdateBilling } from "./types";

export async function getLatestBillingByTeamId(teamId: string) {
    const { data, error } = await supabase.from("billing")
        .select()
        .eq("team_id", teamId)
        .order("billing_date", { ascending: false });

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function updateBillingById(billing: UpdateBilling, id: string) {
    const { data, error } = await supabase.from("billing").update(billing).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function incrementLatestBillingField(teamId: string, billingField: MonthlyBillingField) {
    const latestBilling: SupabaseBilling = await getLatestBillingByTeamId(teamId);
    latestBilling[billingField] += 1;

    await updateBillingById(latestBilling, latestBilling.id);
}
