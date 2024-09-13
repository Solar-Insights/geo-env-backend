import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = await ServerFactory.createFactory().createApp();

serverFactory
    .withDefaultMiddlewares()
    .withAuth()
    .withAllRouters()
    .withResponseHandlers()
    .withErrorMiddlewares()
    .withAnyAvailablePort()
    .createServer();
