import { getUserByAuth0IdAndEmail } from "@/db/users/operations";
import { InvalidParameterError, InvalidTokenError } from "@/middlewares/customErrors";
import { CustomAuth0JwtPayload } from "@/services/types";
import { RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";
import { jwtDecode } from "jwt-decode";
import { getAccessTokenFromRequest } from "@/middlewares/responseHandlers";

export const existingSupabaseUser: RequestHandler = async (req, res, next) => {
    const accessToken = getAccessTokenFromRequest(req)!;
    const decodedAccessToken: CustomAuth0JwtPayload = jwtDecode(accessToken);

    const userId = decodedAccessToken.azp;
    const email = decodedAccessToken.email;
    
    const { data, error } = await getUserByAuth0IdAndEmail(userId, email);

    if (data === null || (data !== null && data.length === 0)) {
        next(makeInvalidTokenErrorWithNotFoundUser(req.url));
        return;
    }

    next();
}

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
        next(makeInvalidCoordError(req.url));
        return;
    }

    next();
};

export function makeInvalidTokenErrorWithNotFoundUser(url: string) {
    return new InvalidTokenError(
        url, 
        "The current user's team could not be identified. Please ask your organisation's administrator for more information."
    );
}

export function makeInvalidCoordError(url: string) {
    return new InvalidParameterError(
        url,
        "Coordinates should respect a certain range, and be numbers. Longitudes range between -180 and 180, and latitudes range between -90 and 90."
    );
}
