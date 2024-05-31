import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/utils/validator";
import { MonthlyBillingField } from "@/server/utils/types";
import { SupabaseBilling, UpdateBilling } from "@/db/billing/types";
import { maximumMonthlyBillingFields } from "@/server/utils/constants";
import { getOrganizationUserCount } from "@/db/users/operations";

export async function getLatestBillingByOrganizationId(organizationId: string) {
    const { data, error } = await supabase
        .from("billing")
        .select()
        .eq("organization_id", organizationId)
        .order("billing_date", { ascending: false });

    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    return data![0];
}

export async function updateBillingById(billing: UpdateBilling, id: string) {
    const { data, error } = await supabase.from("billing").update(billing).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function incrementLatestBillingField(organizationId: string, billingField: MonthlyBillingField) {
    const latestBilling: SupabaseBilling = await getLatestBillingByOrganizationId(organizationId);

    if (!maximumMonthlyBillingFields.includes(billingField)) {
        latestBilling[billingField] += 1;
    } else {
        switch (
            billingField // Check if we're over the limit before setting new max
        ) {
            case "max_members_count":
                const organizationUserCount = await getOrganizationUserCount(organizationId);
                if (organizationUserCount > latestBilling.max_members_count) {
                    console.log("now more members than max members count");
                    latestBilling.max_members_count = organizationUserCount;
                }
                break;
        }
    }

    await updateBillingById(latestBilling, latestBilling.id);
}
