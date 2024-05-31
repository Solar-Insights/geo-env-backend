import { getOrganizationUserCount, getUserByEmail } from "@/db/users/operations";
import {
    InvalidParameterError,
    InvalidTokenError,
    QuotaLimitReachedAlert,
    QuotaLimitReachedError
} from "@/server/utils/errors";
import {
    CustomAuth0JwtPayload,
    MonthlyQuotaField,
    MonthlyQuotaFieldDetailed,
    RoutesAffectingQuotas
} from "@/server/utils/types";
import { RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";
import { getAccessPathFromRequest, getDecodedAccessTokenFromRequest } from "@/server/middlewares/postrequests";
import { getOrganizationByAccessToken } from "@/db/users/helpers";
import {
    routeToMonthlyQuotaFieldMap,
    monthlyQuotaFieldToMonthlyBillingFieldMap,
    pricingTiersQuotas
} from "@/server/utils/constants";
import { getLatestBillingByOrganizationId } from "@/db/billing/operations";

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
        "The current user's organization could not be identified. Please ask your organisation's administrator for more information."
    );
}

export function makeInvalidCoordError(url: string) {
    return new InvalidParameterError(
        url,
        "Coordinates should respect a certain range, and be numbers. Longitudes range between -180 and 180, and latitudes range between -90 and 90."
    );
}

export const respectsPricingTierQuota: RequestHandler = async (req, res, next) => {
    if (!(getAccessPathFromRequest(req) in routeToMonthlyQuotaFieldMap)) {
        next();
        return;
    }

    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
    const organization = await getOrganizationByAccessToken(decodedAccessToken);
    const organizationLatestBilling = await getLatestBillingByOrganizationId(organization.id);

    // TEMPORARY: Probably needs to create an object for max type of values, or maybe a current / max number in the db?
    organizationLatestBilling.max_members_count = await getOrganizationUserCount(organization.id);

    const quotaRoute = getAccessPathFromRequest(req) as RoutesAffectingQuotas;
    const monthlyQuotaField: MonthlyQuotaField = routeToMonthlyQuotaFieldMap[quotaRoute];
    const monthlyQuotaFieldDetailed: MonthlyQuotaFieldDetailed =
        pricingTiersQuotas[organization.pricing_tier][monthlyQuotaField];
    const organizationCurrentValue: number =
        organizationLatestBilling[monthlyQuotaFieldToMonthlyBillingFieldMap[monthlyQuotaField]];

    console.log(organizationCurrentValue, monthlyQuotaFieldDetailed);

    if (organizationCurrentValue >= monthlyQuotaFieldDetailed.value) {
        next(makeQuotaLimitReachedResponse(monthlyQuotaField, monthlyQuotaFieldDetailed.hard, quotaRoute));
    }

    next();
};

export function makeQuotaLimitReachedResponse(monthlyQuotaField: MonthlyQuotaField, hardLimit: boolean, url: string) {
    if (hardLimit) return new QuotaLimitReachedError(url, monthlyQuotaField);
    return new QuotaLimitReachedAlert(url, monthlyQuotaField);
}
