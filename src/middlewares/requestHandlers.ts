import { InvalidParameterError, InvalidTokenFormatError } from "@/middlewares/customErrors";
import { Request, RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";
import { jwtDecode } from "jwt-decode";
import { CustomAuth0JwtPayload } from "@/services/types";

export const authRequiredPermissions = (permission: string | string[]) => {
    if (typeof permission === "string") {
        permission = [permission];
    }
    return claimIncludes("permissions", ...permission);
};

export const validateRequestCoordinates: RequestHandler = (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    if (!validCoordinates(coord)) {
        next(
            new InvalidParameterError(
                req.url,
                "Coordinates should respect a certain range, and be numbers. Longitudes range between -180 and 180, and latitudes range between -90 and 90."
            )
        );
        return;
    }

    next();
};

export const userRequestLogger: RequestHandler = (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req);
    if (accessToken === null) {
        next(new InvalidTokenFormatError(req.url, "Access token is of an invalid format."));
        return;
    }

    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);

    const userEmail = decodedAccessToken.email;
    const ressourcePath = `${req.method} ${req.route.path}`;
    console.log(`user: ${userEmail}`);
    console.log(`accessing ressource: ${ressourcePath}\n`);

    next();
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
