import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withUnsecuredRouter()
    .withSupabaseUserExistenceValidation()
    .withAuth()
    .withAllRouters()
    .withRequestLogger()
    // .withRequestBilling()
    .withResponseHandlers()
    .withErrorLogger()
    .withErrorMiddlewares()
    .createServer();
