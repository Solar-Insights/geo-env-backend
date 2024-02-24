import { ServerFactory } from "@/serverFactory";

const { app, server } = ServerFactory.create().withDefaultValues().build();
