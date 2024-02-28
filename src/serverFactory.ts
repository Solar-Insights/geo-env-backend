import express, { Express } from "express";
import { Server } from "http";
import bodyParser from "body-parser";
import cors from "cors";

import { PORT } from "@/config";
import { errLogger, errResponder, failSafeHandler } from "@/middlewares/error";
import healthRouter from "@/routes/health";
import geoRouter from "@/routes/geo";
import solarRouter from "@/routes/solar";
import airRouter from "@/routes/air";

export class ServerFactory {
    app!: Express;
    server!: Server;
    testEnv: Boolean = false;

    private constructor() {}

    public static create() {
        return new ServerFactory();
    }

    public onTestEnvironnement() {
        this.testEnv = true;
        return this;
    }

    public withDefaultValues() {
        this.app = this.createAppWithDefaultValues();
        if (!this.testEnv) {
            this.server = this.createServerWithDefaultValues(this.app);
        }
        return this;
    }

    private createAppWithDefaultValues() {
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use(healthRouter, geoRouter, solarRouter, airRouter);
        app.use(errLogger, errResponder, failSafeHandler);
        return app;
    }

    private createServerWithDefaultValues(app: Express) {
        return app.listen(PORT, () => {
            console.log("server is open");
        });
    }

    public build() {
        return {
            app: this.app,
            server: this.server
        };
    }
}
