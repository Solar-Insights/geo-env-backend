import { JwtPayload } from "jwt-decode";

export interface CustomAuth0JwtPayload extends JwtPayload {
    permissions: String[] | String;
    email: string;
    azp: string
}

export type MyOrganization = {
    name: string,
    admins: MyOrganizationMember[]
};

export type MyOrganizationMember = {
    created_date: string;
    email: string;
    name: string;
    avatar: string;
};

export type CreateMyOrganizationMemberPayload = {
    email: string,
    name: string
};
