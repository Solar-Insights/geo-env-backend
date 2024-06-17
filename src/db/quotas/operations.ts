import { supabase } from "@/db/init";
import { SupabaseQuotas } from "@/db/quotas/types";
import { OperationValidator } from "@/db/utils/validator";
import { PricingTier } from "@/server/utils/types";

export async function getQuotaByPricingTier(pricingTier: PricingTier) {
    const { data, error } = await supabase.from("quotas").select().eq("pricing_tier", pricingTier);

    new OperationValidator(data, error).validateGetSingleOrLessItemRequest();

    return data![0];
}
