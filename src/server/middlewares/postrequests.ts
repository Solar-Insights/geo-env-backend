import { RequestHandler } from "express";
import {
    CustomAuth0JwtPayload,
    MonthlyBillingField,
    MonthlyQuotaField,
    RoutesAffectingQuotas
} from "@/server/utils/types";
import { getUserByEmail } from "@/db/users/operations";
import { getOrganizationById } from "@/db/organizations/operations";
import { InsertRequest } from "@/db/requests/types";
import { generateRandomUuid } from "@/db/utils/helpers";
import { createRequest } from "@/db/requests/operations";
import { getOrganizationByAccessToken } from "@/db/users/helpers";
import { incrementLatestBillingField } from "@/db/billing/operations";
import { monthlyQuotaFieldToMonthlyBillingFieldMap, routeToMonthlyQuotaFieldMap } from "@/server/utils/constants";
import { getAccessPathFromRequest } from "@/server/utils/helpers";
import { getDecodedAccessTokenFromRequest } from "@/server/utils/helpers";

export const userRequestLogger: RequestHandler = async (req, res, next) => {
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

    console.log("\n--- REQUEST ---");
    console.log(`ressource: ${getAccessPathFromRequest(req)}`);
    console.log(`user: ${decodedAccessToken.email}`);
    console.log(`user id: ${decodedAccessToken.azp}`);

    next();
    return;
};

export const userRequestDatabaseLogger: RequestHandler = async (req, res, next) => {
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

    const user = await getUserByEmail(decodedAccessToken.email);
    const organization = await getOrganizationById(user.organization_id);
    const request: InsertRequest = {
        endpoint: getAccessPathFromRequest(req),
        id: generateRandomUuid(),
        organization_id: organization.id,
        user_id: user.auth0_id
    };

    await createRequest(request);

    console.log("**successfully logged to database");

    next();
    return;
};

export const userRequestBilling: RequestHandler = async (req, res, next) => {
    if (!(getAccessPathFromRequest(req) in routeToMonthlyQuotaFieldMap)) {
        next();
        return;
    }

    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
    const organization = await getOrganizationByAccessToken(decodedAccessToken);

    const quotaRoute = getAccessPathFromRequest(req) as RoutesAffectingQuotas;
    const monthlyQuotaField: MonthlyQuotaField = routeToMonthlyQuotaFieldMap[quotaRoute];
    const monthlyBillingField: MonthlyBillingField = monthlyQuotaFieldToMonthlyBillingFieldMap[monthlyQuotaField];
    await incrementLatestBillingField(organization.id, monthlyBillingField);

    console.log("**successfully added to monthly billing");

    next();
    return;
};
