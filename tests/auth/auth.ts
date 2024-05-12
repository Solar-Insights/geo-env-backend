import { BACKEND_URL, AUTH0_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } from "@/config";
import axios from "axios";

export async function getAuthTokenForTest() {
    return await axios({
        method: "post",
        url: `${AUTH0_BASE_URL}/oauth/token`,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: BACKEND_URL,
            grant_type: "client_credentials"
        }
    })
        .then(async (response) => {
            console.log("successfuly acquired Auth Token for testing");
            const token = response.data.access_token;
            return token;
        })
        .catch((error) => {
            console.log("Can't get Auth Token for testing", error.response.data);
        });
}
