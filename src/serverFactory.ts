import express, { Express } from "express";
import { Server } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

import { PORT, BACKEND_URL, AUTH0_BASE_URL } from "@/config";
import { errLogger, errResponder, failSafeHandler } from "@/middlewares/errorMapper";
import healthRouter from "@/routes/health";
import geoRouter from "@/routes/geo";
import solarRouter from "@/routes/solar";
import airRouter from "@/routes/air";

export class ServerFactory {
    app!: Express;
    server!: Server;
    testEnv: Boolean = false;

    private constructor() {}

    public static createFactory() {
        return new ServerFactory();
    }

    public createApp() {
        console.log("creating app..");
        this.app = express();
        return this;
    }

    public withAuth() {
        if (this.canUseAuth0()) {
            console.log("setting up auth0..");
            const auth0Middleware = this.makeAuth0Middleware();
            this.app.use(auth0Middleware);
        } else {
            console.log("did not setup auth0..");
        }

        return this;
    }

    public canUseAuth0() {
        return BACKEND_URL !== undefined && AUTH0_BASE_URL !== undefined;
    }

    public makeAuth0Middleware() {
        return auth({
            audience: BACKEND_URL,
            issuerBaseURL: AUTH0_BASE_URL,
            tokenSigningAlg: 'RS256'
        });;
    }

    public withDefaultMiddlewares() {
        console.log("setting up cors..");
        this.app.use(cors());

        console.log("setting up body parser..");
        this.app.use(bodyParser.json());

        return this;
    }

    public withHealthRouter() {
        console.log("setting up health router..");
        this.app.use(healthRouter);
        return this;
    }

    public withGeoRouter() {
        console.log("setting up geo router..");
        this.app.use(geoRouter);
        return this;
    }

    public withSolarRouter() {
        console.log("setting up solar router..");
        this.app.use(solarRouter);
        return this;
    }

    public withAirRouter() {
        console.log("setting up air router..");
        this.app.use(airRouter);
        return this;
    }

    public withErrorMiddlewares() {
        console.log("setting up error middlewares..");
        this.app.use(errLogger, errResponder, failSafeHandler);
        return this;
    }

    public createServer() {
        console.log("\ncreating server..");
        if (this.app !== undefined) {
            this.server = this.app.listen(PORT, () => {
                console.log(`express server open on port ${PORT}`);
            });
        } else {
            console.log("no app has been setup yet");
        }
        
        return this;
    }
}
