import { Request } from "express";
import { jwtDecode } from "jwt-decode";
import { BillingInfoFromInvoice, CurrentAndLimitValuesResponse, CustomAuth0JwtPayload, MonthlyBillingField } from "@/server/utils/types";
import Stripe from "stripe";
import { USERS_ID, PLAN_ID, SOLAR_REQUESTS_ID, SOLAR_INSIGHTS_NEGATIVE_INFINITY, monthlyBillingFieldToMonthlyQuotaFieldMap } from "@/server/utils/constants";
import { getOrganizationUserCount } from "@/db/users/operations";
import { getCustomerById } from "@/stripe/customers/operations";
import { getCustomerCurrentNumberOfRequestsFromInvoice, getCustomerUpcomingInvoice } from "@/stripe/invoices/operations";
import { SupabaseOrganization } from "@/db/organizations/types";

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

export async function getCurrentValueForBillingField(upcomingInvoice: Stripe.UpcomingInvoice, organizationId: string, monthlyBillingField: MonthlyBillingField) {
    switch (monthlyBillingField) {
        case "building_insights_requests":
            return await getCustomerCurrentNumberOfRequestsFromInvoice(upcomingInvoice);
        case "members_count":
            return await getOrganizationUserCount(organizationId);
    }
}

export function getLimitValueForBillingField(upcomingInvoice: Stripe.UpcomingInvoice, monthlyBillingField: MonthlyBillingField) {
    const subscriptionMetadata = upcomingInvoice.subscription_details!.metadata!;
    const quotafield = monthlyBillingFieldToMonthlyQuotaFieldMap[monthlyBillingField]
    
    return Number(subscriptionMetadata[quotafield]);
}

export async function getCurrentAndLimitValuesForBillingField(organization: SupabaseOrganization, monthlyBillingField: MonthlyBillingField): Promise<CurrentAndLimitValuesResponse> {
    const customer = await getCustomerById(organization.customer_id);
    const upcomingInvoice = await getCustomerUpcomingInvoice(customer);

    return {
        currentValue: await getCurrentValueForBillingField(upcomingInvoice, organization.id, monthlyBillingField),
        limitValue: getLimitValueForBillingField(upcomingInvoice, monthlyBillingField)
    };
}

export function stripeUpcomingInvoiceToNeededInfo(invoice: Stripe.UpcomingInvoice): BillingInfoFromInvoice {
    const billingInfo: BillingInfoFromInvoice = {
        periodStart: epochTimeToDate(invoice.period_start),
        periodEnd: epochTimeToDate(invoice.period_end),
        dueDate: epochTimeToDate(invoice.due_date),
        building_insights_requests_unit_price_in_cents: SOLAR_INSIGHTS_NEGATIVE_INFINITY,
        max_free_building_insights_requests: 0, // default value
        members_unit_price_in_cents: 500, // default value
        max_free_members_count: 0, // default value
        plan_count: SOLAR_INSIGHTS_NEGATIVE_INFINITY,
        plan_unit_price_in_cents: SOLAR_INSIGHTS_NEGATIVE_INFINITY,
    };

    invoice.lines.data.forEach((line) => {
        const linePricing = line.price;
        const lineQuantity = line.quantity;
        
        if (linePricing === null || lineQuantity === null) {
            return;
        }

        const productId = linePricing.product as string;
        if (productId === SOLAR_REQUESTS_ID) {
            if (line.unit_amount_excluding_tax === "0") {
                billingInfo.max_free_building_insights_requests = lineQuantity;
            } else {
                const tempo = Number(line.unit_amount_excluding_tax);
                billingInfo.building_insights_requests_unit_price_in_cents = tempo === 0 ? 25 : tempo;
            }
        } 
        else if (productId === USERS_ID) {
            if (line.unit_amount_excluding_tax === "0") {
                billingInfo.max_free_members_count = lineQuantity;
            } else {
                billingInfo.members_unit_price_in_cents = Number(line.unit_amount_excluding_tax);
            }
        } 
        else if (productId === PLAN_ID) {
            billingInfo.plan_count = lineQuantity;
            billingInfo.plan_unit_price_in_cents = linePricing.unit_amount!;
        }
    })

    return billingInfo;
}
