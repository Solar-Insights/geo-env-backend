import { PricingTierQuotas, RouteToMonthlyQuotaFieldMap } from "@/services/types";

export const binaryPalette = ["212121", "B3E5FC"];

export const rainbowPalette = ["3949AB", "81D4FA", "66BB6A", "FFE082", "E53935"];

export const ironPalette = ["00000A", "91009C", "E64616", "FEB400", "FFFFF6"];

export const sunlightPalette = ["212121", "FFCA28"];

export const panelsPalette = ["E8EAF6", "1A237E"];

export const roleIds = {
    "OrgMember": "rol_nM2dQUEKVzMhjn1U",
    "OrgAdmin": "rol_I4RWf4h8E9cwpgli"
};

export const routeToMonthlyQuotaFieldMap: RouteToMonthlyQuotaFieldMap = {
    "/user/my-organization/members": "max_free_members_count",
    "/solar/closest-building-insights": "max_building_insights_requests"
};

export const SOLAR_INSIGHTS_INFINITY = 2147483647;

export const pricingTiersQuotas: PricingTierQuotas = {
    starter: {
        max_free_members_count: 1,
        max_building_insights_requests: 100
    },
    pro: {
        max_free_members_count: 8,
        max_building_insights_requests: SOLAR_INSIGHTS_INFINITY
    },
    enterprise: {
        max_free_members_count: 16,
        max_building_insights_requests: SOLAR_INSIGHTS_INFINITY
    },
};