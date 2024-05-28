import { getUserByEmail } from "@/db/users/operations";
import { InvalidParameterError, InvalidTokenError } from "@/middlewares/customErrors";
import { CustomAuth0JwtPayload, PricingTier, RoutesAffectingQuotas } from "@/services/types";
import { RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";
import { getDecodedAccessTokenFromRequest } from "@/middlewares/responseHandlers";
import { getMyOrganizationPricingTier } from "@/services/users";
import { pricingTiersQuotas, routeToMonthlyQuotaFieldMap } from "@/services/constants";

export const existingSupabaseUser: RequestHandler = async (req, res, next) => {
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

    const email = decodedAccessToken.email;

    await getUserByEmail(email); // Throws an error if not existant

    next();
};

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

export const requestRespectsPricingTierQuota: RequestHandler = async (req, res, next) => {
    if (!(req.url in routeToMonthlyQuotaFieldMap)) next();
    
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
    const pricingTier = await getMyOrganizationPricingTier(decodedAccessToken);

    const quotaRoute = req.url as RoutesAffectingQuotas;
    const correspondingMonthlyQuotaField = routeToMonthlyQuotaFieldMap[quotaRoute];
    const monthlyQuotaFieldLimitForTier = pricingTiersQuotas[pricingTier][correspondingMonthlyQuotaField];
    
    next();
};