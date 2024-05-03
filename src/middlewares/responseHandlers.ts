import { Request, RequestHandler } from "express";
import { jwtDecode } from "jwt-decode";
import { CustomAuth0JwtPayload } from "@/services/types";

export const userRequestLogger: RequestHandler = (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);

    const email = `${decodedAccessToken.email}`;
    const accessPath = `${req.method} ${req.route.path}`;

    console.log(`user: ${email}`);
    console.log(`accessing ressource: ${accessPath}\n`);

    next();
};

export const userRequestBilling: RequestHandler = (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);

    const email = decodedAccessToken.email;
    const userId = decodedAccessToken.azp;

    
};

function getAccessTokenFromRequest(req: Request) {
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
