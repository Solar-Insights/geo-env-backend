import { StripePriceNameToPlanMap, StripeProductInfos } from "@/stripe/utils/types";

export const stripePriceNameToPlanMap: StripePriceNameToPlanMap = {
    starter: "Starter Plan",
    pro: "Pro Plan",
    enterprise: "Enterprise Plan"
};

export function getProductIds(): StripeProductInfos {
    return {
        Plan: {
            id: "prod_Qcu70SZjhtBcnP"
        },
        "Solar Installation Analysis Requests": {
            id: "prod_QdFAko4wWVZjZn"
        },
        Users: {
            id: "prod_Qcu56v9n9Y7MBI"
        }
    };
}
