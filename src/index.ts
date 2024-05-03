import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withSupabaseUserExistenceValidation()
    .withAuth()
    .withAllRouters()
    .withBilling()
    .withResponseHandlers()
    .withErrorLogger()
    .withErrorMiddlewares()
    .createServer();
