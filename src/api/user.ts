import axios from "axios";
import { AUTH0_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } from "@/config";
import { Auth0User } from "@/services/types";

export async function getManagementAPIToken() {
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
        .catch((error) => {
            throw error;
        });
}

export async function manuallyCreateAuth0User(managementAPIToken: string, email: string, name: string) {
    const newUserData = {
        email: email,
        email_verified: false,
        nickname: name,
        connection: "Username-Password-Authentication",
        password: "Mathisledrole12",
        verify_email: false
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
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

export async function sendEmailForEmailVerification(managementAPIToken: string, userId: string) {
    const userData = {
        user_id: userId
    };

    await axios({
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${managementAPIToken}`
        },
        responseType: "json",
        url: `${AUTH0_BASE_URL}/api/v2/jobs/verification-email`,
        data: userData
    })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

export async function sendEmailForPasswordReset(email: string) {
    const passwordResetData = {
        client_id: AUTH0_CLIENT_ID,
        email: email,
        connection: 'Username-Password-Authentication'
    };

    await axios({
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        responseType: "json",
        url: `${AUTH0_BASE_URL}/dbconnections/change_password`,
        data: passwordResetData
    })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

export async function assignRolesToUser(managementAPIToken: string, userId: string, roles: string[]) {
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
        .catch((error) => {
            console.log(error);
            throw error;
        });
}
