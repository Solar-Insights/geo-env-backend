import axios from "axios";
import { AUTH0_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } from "@/server/utils/env";
import { Auth0User } from "@/server/utils/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { ApiGeneric } from "@/api/utils/apiGeneric";
import { ApiError } from "@/api/utils/errors";
import { Request } from "express";

export class UserApi extends ApiGeneric {
    public constructor(req: Request) {
        super(req);
    }

    public async getManagementAPIToken() {
        return await axios({
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            responseType: "json",
            url: `${AUTH0_BASE_URL}/oauth/token`,
            data: {
                client_id: AUTH0_CLIENT_ID,
                client_secret: AUTH0_CLIENT_SECRET,
                audience: `${AUTH0_BASE_URL}/api/v2/`,
                grant_type: "client_credentials"
            }
        })
            .then((response) => {
                return response.data.access_token as string;
            })
            .catch(() => {
                throw new ApiError(this.req.url);;
            });
    }

    public async manuallyCreateAuth0User(managementAPIToken: string, email: string, name: string) {
        const newUserData = {
            email: email,
            email_verified: false,
            nickname: name,
            connection: "Username-Password-Authentication",
            password: generateRandomUuid(),
            verify_email: true
        };
    
        return await axios({
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${managementAPIToken}`
            },
            responseType: "json",
            url: `${AUTH0_BASE_URL}/api/v2/users`,
            data: newUserData
        })
            .then((response) => {
                return response.data as Auth0User;
            })
            .catch(() => {
                throw new ApiError(this.req.url);
            });
    }

    public async sendEmailForPasswordReset(email: string) {
        const passwordResetData = {
            client_id: AUTH0_CLIENT_ID,
            email: email,
            connection: "Username-Password-Authentication"
        };
    
        await axios({
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            responseType: "json",
            url: `${AUTH0_BASE_URL}/dbconnections/change_password`,
            data: passwordResetData
        })
            .catch(() => {
                throw new ApiError(this.req.url);
            });
    }

    public async assignRolesToUser(managementAPIToken: string, userId: string, roles: string[]) {
        const rolesData = {
            roles: roles
        };
    
        await axios({
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${managementAPIToken}`
            },
            responseType: "json",
            url: `${AUTH0_BASE_URL}/api/v2/users/${userId}/roles`,
            data: rolesData
        })
            .catch(() => {
                throw new ApiError(this.req.url);
            });
    }

    public async deleteAuth0User(managementAPIToken: string, userId: string) {
        await axios({
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${managementAPIToken}`
            },
            responseType: "json",
            url: `${AUTH0_BASE_URL}/api/v2/users/${userId}`
        })
            .catch(() => {
                throw new ApiError(this.req.url);
            });
    }
}