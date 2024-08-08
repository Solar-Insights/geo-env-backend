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

export function stripeUpcomingInvoiceToNeededInfo(invoice: Stripe.UpcomingInvoice): BillingInfoFromInvoice {
    const billingInfo: BillingInfoFromInvoice = {
        periodStart: epochTimeToDate(invoice.period_start),
        periodEnd: epochTimeToDate(invoice.period_end),
        dueDate: epochTimeToDate(invoice.due_date),
        building_insights_requests: null,
        building_insights_requests_price: null,
        members_count: null,
        members_price: null,
        plan_count: null,
        plan_price: null,
    };
    
    invoice.lines.data.forEach((line) => {
        const linePrice = line.price;
        if (linePrice === null) {
            return;
        }

        const productId = linePrice.product as string;
        const productQuantity = line.quantity;
        const productUnitPrice = linePrice.unit_amount;

        if (productId === SOLAR_REQUESTS_ID) {
            billingInfo.building_insights_requests = productQuantity;
            billingInfo.building_insights_requests_price = productUnitPrice;
        } 
        else if (productId === ADDITIONAL_USERS_ID) {
            billingInfo.members_count = productQuantity;
            billingInfo.members_price = productUnitPrice;
        } 
        else if (PLAN_IDS.includes(productId)) {
            billingInfo.plan_count = productQuantity;
            billingInfo.plan_price = productUnitPrice;
        }
    })

    return billingInfo;
}

