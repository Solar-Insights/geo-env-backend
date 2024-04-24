import { BACKEND_URL, AUTH0_TESTING_CLIENT_ID, AUTH0_TESTING_CLIENT_SECRET } from "@/config";
import axios from "axios";

export async function getAuthTokenForTest() {
    return await axios({
        method: "post",
        url: "https://dev-ubs32bgn56n1z15q.us.auth0.com/oauth/token",
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "client_id": AUTH0_TESTING_CLIENT_ID,
            "client_secret": AUTH0_TESTING_CLIENT_SECRET,
            "audience": BACKEND_URL,
            "grant_type": "client_credentials"
        },
    })
        .then(async (response) => {
            console.log("Successfully acquired Auth Token for testing");
            const token = response.data.access_token;
            return token;
        })
        .catch((error) => {
            console.log("Can't get Auth Token for testing", error.response.data);
        });
}