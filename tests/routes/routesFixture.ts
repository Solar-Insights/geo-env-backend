import { Express } from "express";
import { Server } from "http";
import { setupApp, setupServer } from "../../src/setup";

export class RoutesFixture {
    app: Express;
    server: Server;

    private constructor() {}

    public static create() {
        return new RoutesFixture();
    }

    public withDefaultValues() {
        this.app = setupApp();
        this.server = setupServer(this.app);
        return this;
    }

    public build() {
        return this;
    }
}
