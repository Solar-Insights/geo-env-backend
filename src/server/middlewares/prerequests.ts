import { getUserByEmail } from "@/db/users/operations";
import { InvalidParameterError, QuotaLimitReachedError } from "@/server/utils/errors";
import {
    CustomAuth0JwtPayload,
    MonthlyBillingField,
    MonthlyQuotaField,
    MonthlyQuotaFieldDetailed,
    RoutesAffectingQuotas
} from "@/server/utils/types";
import { RequestHandler } from "express";
import { claimIncludes } from "express-oauth2-jwt-bearer";
import { Coordinates, validCoordinates } from "geo-env-typing/geo";
import { getAccessPathFromRequest, getDecodedAccessTokenFromRequest } from "@/server/utils/helpers";
import { getOrganizationByAccessToken } from "@/db/users/helpers";
import { routeToMonthlyQuotaFieldMap, monthlyQuotaFieldToMonthlyBillingFieldMap } from "@/server/utils/constants";
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

    const quotaRoute = getAccessPathFromRequest(req) as RoutesAffectingQuotas;
    const monthlyQuotaField: MonthlyQuotaField = routeToMonthlyQuotaFieldMap[quotaRoute];
    const monthlyBillingField: MonthlyBillingField = monthlyQuotaFieldToMonthlyBillingFieldMap[monthlyQuotaField];

    const maxValue = organizationLatestBilling[monthlyQuotaField];
    const currentValue = organizationLatestBilling[monthlyBillingField];

    if (currentValue >= maxValue) {
        throw new QuotaLimitReachedError(monthlyQuotaField);
    }

    next();
    return;
};
