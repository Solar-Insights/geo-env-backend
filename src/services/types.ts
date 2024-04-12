import { JwtPayload } from "jwt-decode";

export interface CustomAuth0JwtPayload extends JwtPayload {
    permissions?: String[] | String,
    email?: string
};
