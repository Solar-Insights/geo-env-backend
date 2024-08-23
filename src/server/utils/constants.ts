import {
    RouteToMonthlyQuotaFieldMap,
    MonthlyQuotaFieldToMonthlyBillingFieldMap,
    MonthlyBillingFieldToMonthlyQuotaFieldMap
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
    "POST /user/my-organization/members": "max_members_count",
    "GET /solar/closest-building-insights": "max_building_insights_requests"
};

export const monthlyQuotaFieldToMonthlyBillingFieldMap: MonthlyQuotaFieldToMonthlyBillingFieldMap = {
    max_members_count: "members_count",
    max_building_insights_requests: "building_insights_requests"
};

export const monthlyBillingFieldToMonthlyQuotaFieldMap: MonthlyBillingFieldToMonthlyQuotaFieldMap = {
    members_count: "max_members_count",
    building_insights_requests: "max_building_insights_requests"
};

export const SOLAR_INSIGHTS_INFINITY = 2147483647;

export const SOLAR_INSIGHTS_NEGATIVE_INFINITY = -2147483647;

export const PLAN_ID = "prod_Qcu70SZjhtBcnP";

export const USERS_ID = "prod_Qcu56v9n9Y7MBI";

export const SOLAR_REQUESTS_ID = "prod_QdFAko4wWVZjZn";
