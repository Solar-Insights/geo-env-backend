import {
    RouteToMonthlyQuotaFieldMap,
    MonthlyQuotaFieldToMonthlyBillingFieldMap,
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

export const SOLAR_INSIGHTS_INFINITY = 2147483647;

export const STRIPE_IDS = {
    "prod_QV09EbwcXFbDNi": "solar_requests"
}

export const PLAN_IDS = ["prod_QUzwdWLycoc5TO", "prod_QUdsMKTfR6ktYd", "prod_QUdtyopu6WAWdT"];

export const ADDITIONAL_USERS_ID = "prod_QcVT3e1sheDCre";

export const SOLAR_REQUESTS_ID = "prod_QV09EbwcXFbDNi";