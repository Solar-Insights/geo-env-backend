import { ServerFactory } from "@/serverFactory";

const factory: ServerFactory = ServerFactory.createFactory().createApp()
    .withAuth()
    .withDefaultMiddlewares()
    .withHealthRouter()
    .withSolarRouter()
    .withAirRouter()
    .withErrorMiddlewares()
    .createServer();


