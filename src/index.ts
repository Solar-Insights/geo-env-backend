import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory()
    .createApp()
    .withDefaultMiddlewares()
    .withAuth()
    .withAllRouters()
    .withErrorMiddlewares()
    .createServer();
