import { stripe } from "@/stripe/init";

const meterEvent = await stripe.billing.meterEvents.create({
    event_name: 'ai_search_api',
    payload: {
      value: '25',
      stripe_customer_id: 'cus_NciAYcXfLnqBoz',
    },
    identifier: 'identifier_123',
});