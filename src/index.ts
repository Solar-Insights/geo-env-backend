import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withUnsecuredRouter()
    .withSupabaseUserExistenceValidation()
    .withAuth()
    .withRequestLogger()
    .withAllRouters()
    .withRequestDatabaseLogger()
    .withRequestBilling()
    .withResponseHandlers()
    .withErrorLogger()
    .withErrorMiddlewares()
    .createServer();
