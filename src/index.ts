import { ServerFactory } from "@/serverFactory";

const serverFactory: ServerFactory = await ServerFactory.createFactory().createApp();

serverFactory
    .withDefaultMiddlewares()
    .withUnsecuredRouter()
    .withSupabaseUserExistenceValidation()
    .withAuth()
    .withRequestLogger()
    .withPricingTierQuotaVerification()
    .withAllRouters()
    .withRequestDatabaseLogger()
    .withRequestBilling()
    .withResponseHandlers()
    .withErrorLogger()
    .withErrorMiddlewares()
    .createServer();
