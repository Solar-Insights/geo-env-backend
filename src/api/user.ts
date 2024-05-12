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
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "audience": `${AUTH0_BASE_URL}/api/v2/`,
            "grant_type": "client_credentials"
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
      "email": email,
      "email_verified": false,
      "nickname": name,
      "connection": "Username-Password-Authentication",
      "password": "Mathisledrole12",
      "verify_email": false
    };

    return await axios({
        method: "post",
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            "Authorization": `Bearer ${managementAPIToken}`
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