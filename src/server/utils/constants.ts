import {
    RouteToMonthlyQuotaFieldMap,
    MonthlyQuotaFieldToMonthlyBillingFieldMap,
    MonthlyBillingField,
    PricingTierQuotas
} from "@/server/utils/types";

export const binaryPalette = ["212121", "B3E5FC"];

export const rainbowPalette = ["3949AB", "81D4FA", "66BB6A", "FFE082", "E53935"];

export const ironPalette = ["00000A", "91009C", "E64616", "FEB400", "FFFFF6"];

export const sunlightPalette = ["212121", "FFCA28"];

export const panelsPalette = ["E8EAF6", "1A237E"];

export const roleIds = {
    OrgMember: "rol_nM2dQUEKVzMhjn1U",
    OrgAdmin: "rol_I4RWf4h8E9cwpgli"
};

export const routeToMonthlyQuotaFieldMap: RouteToMonthlyQuotaFieldMap = {
    "POST /user/my-organization/members": "max_free_members_count",
    "GET /solar/closest-building-insights": "max_building_insights_requests"
};

export const monthlyQuotaFieldToMonthlyBillingFieldMap: MonthlyQuotaFieldToMonthlyBillingFieldMap = {
    max_free_members_count: "max_members_count",
    max_building_insights_requests: "building_insights_requests"
};

export const maximumMonthlyBillingFields: MonthlyBillingField[] = ["max_members_count"];

export const SOLAR_INSIGHTS_INFINITY = 2147483647;

export const pricingTiersQuotas: PricingTierQuotas = {
    starter: {
        max_free_members_count: {
            value: 1,
            hard: true
        },
        max_building_insights_requests: {
            value: 100,
            hard: true
        }
    },
    pro: {
        max_free_members_count: {
            value: 8,
            hard: false
        },
        max_building_insights_requests: {
            value: SOLAR_INSIGHTS_INFINITY,
            hard: true
        }
    },
    enterprise: {
        max_free_members_count: {
            value: 16,
            hard: false
        },
        max_building_insights_requests: {
            value: SOLAR_INSIGHTS_INFINITY,
            hard: true
        }
    }
};
