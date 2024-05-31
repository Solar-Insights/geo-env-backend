import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/utils/validator";
import { MonthlyBillingField } from "@/services/types";
import { SupabaseBilling, UpdateBilling } from "@/db/billing/types";
import { maximumMonthlyBillingFields } from "@/services/constants";
import { getTeamUserCount } from "@/db/users/operations";

export async function getLatestBillingByTeamId(teamId: string) {
    const { data, error } = await supabase.from("billing")
        .select()
        .eq("team_id", teamId)
        .order("billing_date", { ascending: false });

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data![0];
}

export async function updateBillingById(billing: UpdateBilling, id: string) {
    const { data, error } = await supabase.from("billing").update(billing).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function incrementLatestBillingField(teamId: string, billingField: MonthlyBillingField) {
    const latestBilling: SupabaseBilling = await getLatestBillingByTeamId(teamId);

    if (!maximumMonthlyBillingFields.includes(billingField)) {
        latestBilling[billingField] += 1;
    } else {
        switch (billingField) { // Check if we're over the limit before setting new max
            case "max_members_count":
                const teamUserCount = await getTeamUserCount(teamId);
                if (teamUserCount > latestBilling.max_members_count) {
                    console.log("now more members than max members count")
                    latestBilling.max_members_count = teamUserCount;
                }
                break;
        }
    }

    await updateBillingById(latestBilling, latestBilling.id);
}