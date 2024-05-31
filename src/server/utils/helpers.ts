import { Request } from "express";
import { jwtDecode } from "jwt-decode";
import { CustomAuth0JwtPayload } from "@/server/utils/types";

export function getAccessPathFromRequest(req: Request) {
    return `${req.method} ${req.path}`;
}

export function getDecodedAccessTokenFromRequest(req: Request) {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);
    return decodedAccessToken;
}

function getAccessTokenFromRequest(req: Request) {
    const authorization = req.headers.authorization;
    const bearerString = "Bearer ";
    if (authorization === undefined || !authorization.startsWith(bearerString)) {
        return null;
    }

    const accessToken = authorization.slice(bearerString.length);
    return accessToken;
}
