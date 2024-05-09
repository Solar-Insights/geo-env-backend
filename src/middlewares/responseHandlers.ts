import { Request, RequestHandler } from "express";
import { jwtDecode } from "jwt-decode";
import { CustomAuth0JwtPayload } from "@/services/types";
import { getUserByEmail } from "@/db/users/operations";
import { getTeamById } from "@/db/teams/operations";
import { InsertRequest } from "@/db/requests/types";
import { generateRandomUuid } from "@/db/utils";
import { createRequest } from "@/db/requests/operations";

export const userRequestLogger: RequestHandler = (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);
    
    const email = decodedAccessToken.email;
    const userId = decodedAccessToken.azp;
    const accessPath = getAccessPathFromRequest(req);

    console.log("\n--- REQUEST ---")
    console.log(`ressource: ${accessPath}`);
    console.log(`user: ${email}`);
    console.log(`user id: ${userId}`)
    
    next();
};

export const userRequestBilling: RequestHandler = async (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);

    const email = decodedAccessToken.email;
    const user = await getUserByEmail(email);

    const team = await getTeamById(user.team_id);

    const request: InsertRequest = {
        endpoint: getAccessPathFromRequest(req),
        id: generateRandomUuid(),
        team_id: team.id,
        user_id: user.auth0_id
    };
    await createRequest(request);

    console.log("**successfully billed to user");

    next();
};

export function getAccessTokenFromRequest(req: Request) {
    const authorization = req.headers.authorization;
    const bearerString = "Bearer ";
    if (authorization === undefined || !authorization.startsWith(bearerString)) {
        return null;
    }

    const accessToken = authorization.slice(bearerString.length);
    return accessToken;
}

export const userResponseHandler: RequestHandler = (req, res, next) => {
    const data = res.locals.data;
    res.json(data);
};

export function getAccessPathFromRequest(req: Request) {
    return `${req.method} ${req.route.path}`;
}