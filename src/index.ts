import { ServerFactory } from "@/serverFactory";

const factory: ServerFactory = ServerFactory.createFactory().createApp()
    .withAuth()
    .withDefaultMiddlewares()
    .withAllRouters()
    .withErrorMiddlewares()
    .createServer();


