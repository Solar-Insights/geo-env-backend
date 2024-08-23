export type StripeProductName = "Plan" | "Users" | "Solar Installation Analysis Requests";

type StripePriceName = "Starter Plan" | "Pro Plan" | "Enterprise Plan";

export type ProductInfoDescription = {
    id: string
} & {
    [key in StripePriceName]?: string
};

export type StripeProductInfos = {
    [key in StripeProductName]: ProductInfoDescription
};
