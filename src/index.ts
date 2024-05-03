import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withSupabaseUserExistenceValidation()
    .withAuth()
    .withAllRouters()
    .withRequestLogger()
    .withRequestBilling()
    .withResponseHandlers()
    .withErrorLogger()
    .withErrorMiddlewares()
    .createServer();
