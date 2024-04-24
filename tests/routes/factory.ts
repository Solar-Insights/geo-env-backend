import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withAuth()
    .withAllRouters()
    .withResponseHandlers()
    .withErrorMiddlewares()
    .withAnyAvailablePort()
    .createServer();
