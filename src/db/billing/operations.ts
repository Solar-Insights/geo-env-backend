import { supabase } from "@/db/init";
import { OperationValidator } from "@/db/utils/validator";
import { MonthlyBillingField } from "@/server/utils/types";
import { SupabaseBilling, UpdateBilling, InsertBilling } from "@/db/billing/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { getOrganizationUserCount } from "@/db/users/operations";

export async function autocreateNewBilling(oldBilling: SupabaseBilling) {
    const newBillingDate = new Date(oldBilling.billing_date);
    newBillingDate.setMonth(newBillingDate.getMonth() + 1);

    const newBilling: InsertBilling = {
        organization_id: oldBilling.organization_id,
        id: generateRandomUuid(),
        billing_date: newBillingDate.toISOString().substring(0, 10),
        building_insights_requests: 0,
        members_count: await getOrganizationUserCount(oldBilling.organization_id),
        max_building_insights_requests: oldBilling.max_building_insights_requests,
        max_members_count: oldBilling.max_members_count
    };

    const { data, error } = await supabase.from("billing").insert(newBilling).select();

    new OperationValidator(data, error).validateGetSingleItemRequest();

    return data![0];
}

export async function getLatestBillingByOrganizationId(organizationId: string) {
    const { data, error } = await supabase
        .from("billing")
        .select()
        .eq("organization_id", organizationId)
        .order("billing_date", { ascending: false });
    
    new OperationValidator(data, error).validateGetSingleOrMoreItemRequest();

    const latestBilling = data![0];
    const latestBillingDate = new Date(latestBilling.billing_date); // YYYY-MM-DD format in DB
    const now = new Date();

    if (latestBillingDate > now) return latestBilling // request made before billing date
    return await autocreateNewBilling(latestBilling) // request made after 
}

export async function updateBillingById(billing: UpdateBilling, id: string) {
    const { data, error } = await supabase.from("billing").update(billing).eq("id", id);

    new OperationValidator(data, error).validateUpdateRequest();
}

export async function incrementLatestBillingField(organizationId: string, billingField: MonthlyBillingField) {
    const latestBilling: SupabaseBilling = await getLatestBillingByOrganizationId(organizationId);

    latestBilling[billingField] += 1;
    
    await updateBillingById(latestBilling, latestBilling.id);
}
