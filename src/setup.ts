import express, { Express } from "express";
import { Server } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { errLogger, errResponder, failSafeHandler } from "@/middlewares/error";
import healthRouter from "@/routes/health";
import geoRouter from "@/routes/geo";
import solarRouter from "@/routes/solar";
import airRouter from "@/routes/air";
import { PORT } from "@/config";

export function setupApp() {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(healthRouter, geoRouter, solarRouter, airRouter);
    app.use(errLogger, errResponder, failSafeHandler);

    return app;
}

export function setupServer(app: Express) {
    return app.listen(PORT, () => {
        console.log("server is open");
    });
}
