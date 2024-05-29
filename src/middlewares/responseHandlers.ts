import { Request, RequestHandler } from "express";
import { jwtDecode } from "jwt-decode";
import { CustomAuth0JwtPayload, MonthlyBillingField, MonthlyQuotaField, RoutesAffectingQuotas } from "@/services/types";
import { getUserByEmail } from "@/db/users/operations";
import { getTeamById } from "@/db/teams/operations";
import { InsertRequest } from "@/db/requests/types";
import { generateRandomUuid } from "@/db/utils";
import { createRequest } from "@/db/requests/operations";
import { getOrganizationByAccessToken } from "@/services/users";
import { incrementLatestBillingField } from "@/db/billing/operations";
import { monthlyQuotaFieldToMonthlyBillingFieldMap, routeToMonthlyQuotaFieldMap } from "@/services/constants";

export const userRequestLogger: RequestHandler = async (req, res, next) => {
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

    console.log("\n--- REQUEST ---");
    console.log(`ressource: ${getAccessPathFromRequest(req)}`);
    console.log(`user: ${decodedAccessToken.email}`);
    console.log(`user id: ${decodedAccessToken.azp}`);

    next();
};

export const userRequestDatabaseLogger: RequestHandler = async (req, res, next) => {
    const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

    const user = await getUserByEmail(decodedAccessToken.email);
    const team = await getTeamById(user.team_id);
    const request: InsertRequest = {
        endpoint: getAccessPathFromRequest(req),
        id: generateRandomUuid(),
        team_id: team.id,
        user_id: user.auth0_id
    };

    await createRequest(request);

    console.log("**successfully logged to database");

    next();
}

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
    await incrementLatestBillingField(organization.id, monthlyBillingField)

    console.log("**successfully added to monthly billing");

    next();
};

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

export const userResponseHandler: RequestHandler = (req, res, next) => {
    const data = res.locals.data;
    res.json(data);
};

export function getAccessPathFromRequest(req: Request) {
    return `${req.method} ${req.path}`;
}
