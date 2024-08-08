import { Request } from "express";
import { jwtDecode } from "jwt-decode";
import { BillingInfoFromInvoice, CustomAuth0JwtPayload } from "@/server/utils/types";
import Stripe from "stripe";
import { ADDITIONAL_USERS_ID, PLAN_IDS, SOLAR_REQUESTS_ID } from "@/server/utils/constants";

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

export function epochTimeToDate(epochTime: EpochTimeStamp | null) {
    if (epochTime === null) return "";
    
    const epochTimeInMilli = epochTime * 1000;
    return new Date(epochTimeInMilli).toISOString().substring(0, 10);
}

export function stripeInvoiceToNeededInfo(invoice: Stripe.UpcomingInvoice): BillingInfoFromInvoice {
    const billingInfo: BillingInfoFromInvoice = {
        periodStart: epochTimeToDate(invoice.period_start),
        periodEnd: epochTimeToDate(invoice.period_end),
        dueDate: epochTimeToDate(invoice.due_date),
        building_insights_requests: 0,
        building_insights_requests_price: 0,
        members_count: 0,
        members_price: 0,
        plan_count: 0,
        plan_price: 0,
    };
    
    invoice.lines.data.forEach((line) => {
        const lineProductId = line.plan!.product as string;
        if (lineProductId === SOLAR_REQUESTS_ID) {
            billingInfo.building_insights_requests;
            billingInfo.building_insights_requests_price;
        } 
        else if (lineProductId === ADDITIONAL_USERS_ID) {
            billingInfo.members_count;
            billingInfo.members_price;
        } 
        else if (PLAN_IDS.includes(lineProductId)) {
            billingInfo.plan_count;
            billingInfo.plan_price
        }
    })

    return billingInfo;
}

