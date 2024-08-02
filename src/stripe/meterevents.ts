import { MonthlyBillingField } from "@/server/utils/types";
import { stripe } from "@/stripe/init";

const REQUESTS_EVENT_NAME = "building_insights_requests";
const USERS_EVENT_NAME = "users";

export async function makeStripeMeterEvent(customerId: string, eventId: string, monthlyBillingField: MonthlyBillingField) {
    switch (monthlyBillingField) {
        case "building_insights_requests": 
            await makeStripeRequestsEvent(customerId, eventId);
            break;
        case "members_count":
            await makeStripeUsersEvent(customerId, eventId);
            break;
    }
}

async function makeStripeRequestsEvent(customerId: string, eventId: string) {
    await stripe.billing.meterEvents.create({
        event_name: REQUESTS_EVENT_NAME,
        payload: {
          value: "0",
          stripe_customer_id: customerId,
        },
        identifier: eventId,
    })
}

async function makeStripeUsersEvent(customerId: string, eventId: string) {
    await stripe.billing.meterEvents.create({
        event_name: USERS_EVENT_NAME,
        payload: {
          value: "0",
          stripe_customer_id: customerId,
        },
        identifier: eventId,
    })
}