import { JwtPayload } from "jwt-decode";

export type nodeEnv = "production" | "development";

export interface CustomAuth0JwtPayload extends JwtPayload {
    permissions: String[] | String;
    email: string;
    azp: string;
}

export type MyOrganization = {
    name: string;
    admins: MyOrganizationMember[];
};

export type MyOrganizationMember = {
    created_date: string;
    email: string;
    name: string;
    avatar: string;
};

export type CreateMyOrganizationMemberPayload = {
    email: string;
    name: string;
};

export type Auth0User = {
    created_at: string;
    email: string;
    email_verified: boolean;
    identities: Object[];
    name: string;
    nickname: string;
    picture: string;
    updated_at: string;
    user_id: string;
};

export type PricingTier = "starter" | "pro" | "enterprise";

export type NewOrganizationForm = {
    name: string;
    contactEmail: string;
    pricingTier: PricingTier;
    modifiyingExistingPlan: boolean;
    additionalNotes: string;
};

export type EmailOperationType = "SENDING" | "READING";

export type PricingTierQuotas = {
    [key in PricingTier]: {
        [key in MonthlyQuotaField]: MonthlyQuotaFieldDetailed;
    };
};

export type MonthlyQuotaFieldDetailed = {
    value: number;
    hard: boolean;
};

export type RouteToMonthlyQuotaFieldMap = {
    [key in RoutesAffectingQuotas]: MonthlyQuotaField;
};

export type RoutesAffectingQuotas = "GET /solar/closest-building-insights" | "POST /user/my-organization/members";

export type MonthlyFreeField = "max_free_members_count" | "max_free_building_insights_requests";

export type MonthlyQuotaField = "max_members_count" | "max_building_insights_requests";

export type MonthlyBillingField = "members_count" | "building_insights_requests";

export type MonthlyBillingPrice = "members_unit_price_in_cents" | "building_insights_requests_unit_price_in_cents";

export type MonthlyPlanInfo = "plan_count" | "plan_unit_price_in_cents";

export type BillingInfoFromInvoice = {
    [key in MonthlyBillingPrice]: number;
} & {
    [key in MonthlyPlanInfo]: number;
} & {
    [key in MonthlyFreeField]: number;
} & {
    periodStart: string;
    periodEnd: string;
    dueDate: string;
};

export type MyOrganizationBillingRecap = {
    [key in MonthlyQuotaField]: number;
} & {
    [key in MonthlyBillingField]: number;
} & {
    pricingTier: PricingTier;
} & BillingInfoFromInvoice;

export type MonthlyQuotaFieldToMonthlyBillingFieldMap = {
    [key in MonthlyQuotaField]: MonthlyBillingField;
};

export type MonthlyBillingFieldToMonthlyQuotaFieldMap = {
    [key in MonthlyBillingField]: MonthlyQuotaField;
};

export type MyOrganizationDetails = {
    admins: MyOrganizationMember[];
    name: string;
};

export type MyOrganizationAdminDetails = {
    myOrganizationMembers: MyOrganizationMember[];
    myOrganizationBillingRecap: MyOrganizationBillingRecap;
};

export type CurrentAndLimitValuesResponse = {
    currentValue: number;
    limitValue: number;
};
