import { getOrganizationUserCount, getUserByEmail } from "@/db/users/operations";
import {
    InvalidParameterError,
    makeQuotaLimitReachedResponse,
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
import { getAccessPathFromRequest, getDecodedAccessTokenFromRequest } from "@/server/utils/helpers";
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
    return;
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
        throw new InvalidParameterError().forInvalidCoord();
    }

    next();
    return;
};

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

    if (organizationCurrentValue >= monthlyQuotaFieldDetailed.value) {
        makeQuotaLimitReachedResponse(monthlyQuotaField, monthlyQuotaFieldDetailed.hard);
        return;
    }

    next();
    return;
};
