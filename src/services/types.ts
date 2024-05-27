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