import { ServerFactory } from "@/serverFactory";

export const serverFactory: ServerFactory = ServerFactory.createFactory().createApp()
    .withAuth()
    .withDefaultMiddlewares()
    .withAllRouters()
    .withErrorMiddlewares()
    .createServer();


