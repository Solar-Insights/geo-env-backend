import { JwtPayload } from "jwt-decode";

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
    additionalNotes: string;
};

export type EmailOperationType = "SENDING" | "READING";

export type PricingTierQuotas = {
    [key in PricingTier]: {
        [key in MonthlyQuotaField]: number
    };
};

export type RouteToMonthlyQuotaFieldMap = {
    [key in RoutesAffectingQuotas]: MonthlyQuotaField
};

export type RoutesAffectingQuotas = "/solar/closest-building-insights" | "/user/my-organization/members";

export type MonthlyQuotaField = "max_free_members_count" | "max_building_insights_requests";
