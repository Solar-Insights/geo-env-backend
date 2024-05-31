import express, { Express } from "express";
import { Server } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import { PORT, BACKEND_URL, AUTH0_BASE_URL } from "@/server/utils/env";
import { errLogger, errResponder, failSafeHandler } from "@/server/middlewares/errorMappers";
import healthRouter from "@/server/routes/health";
import geoRouter from "@/server/routes/geo";
import solarRouter from "@/server/routes/solar";
import userRouter from "@/server/routes/user";
import { userRequestLogger, userRequestBilling, userRequestDatabaseLogger } from "@/server/middlewares/postrequests";
import { userResponseHandler } from "@/server/middlewares/responses";
import { AddressInfo } from "net";
import { existingSupabaseUser, respectsPricingTierQuota } from "@/server/middlewares/prerequests";
import unsecuredRouter from "@/server/routes/unsecured";

export class ServerFactory {
    app!: Express;
    server!: Server;
    testEnv: Boolean = false;
    port: Number = PORT;

    private constructor() {}

    public static createFactory() {
        return new ServerFactory();
    }

    public createApp() {
        console.log("creating app..");
        this.app = express();
        return this;
    }

    public withSupabaseUserExistenceValidation() {
        console.log("setting up supabase user existence validation..");
        this.app.use(existingSupabaseUser);
        return this;
    }

    public withAuth() {
        console.log("setting up auth0..");
        if (this.canUseAuth0()) {
            const auth0Middleware = this.makeAuth0Middleware();
            this.app.use(auth0Middleware);
        } else {
            console.log("could not find the required environment variables to setup up auth0");
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
            tokenSigningAlg: "RS256"
        });
    }

    public withDefaultMiddlewares() {
        console.log("setting up cors..");
        this.app.use(cors());

        console.log("setting up body parser..");
        this.app.use(bodyParser.json());

        return this;
    }

    public withUnsecuredRouter() {
        console.log("setting up unsecured router..");
        this.app.use(unsecuredRouter);
        return this;
    }

    public withAllRouters() {
        this.withHealthRouter();
        this.withGeoRouter();
        this.withSolarRouter();
        this.withUserRouter();
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

    public withPricingTierQuotaVerification() {
        console.log("setting up pricing tier quota verification..");
        this.app.use(respectsPricingTierQuota);
        return this;
    }

    public withSolarRouter() {
        console.log("setting up solar router..");
        this.app.use(solarRouter);
        return this;
    }

    public withUserRouter() {
        console.log("setting up user router..");
        this.app.use(userRouter);
        return this;
    }

    public withRequestDatabaseLogger() {
        console.log("setting up request database logger..");
        this.app.use(userRequestDatabaseLogger);
        return this;
    }

    public withRequestLogger() {
        console.log("setting up request logger..");
        this.app.use(userRequestLogger);
        return this;
    }

    public withRequestBilling() {
        console.log("setting up billing..");
        this.app.use(userRequestBilling);
        return this;
    }

    public withResponseHandlers() {
        console.log("setting up response middlewares..");
        this.app.use(userResponseHandler);
        return this;
    }

    public withErrorLogger() {
        console.log("setting up error logger..");
        this.app.use(errLogger);
        return this;
    }

    public withErrorMiddlewares() {
        console.log("setting up error middlewares..");
        this.app.use(errResponder, failSafeHandler);
        return this;
    }

    public withAnyAvailablePort() {
        console.log("setting server port to 0");
        this.port = 0;
        return this;
    }

    public createServer() {
        console.log("\ncreating server..");
        if (this.app !== undefined) {
            this.server = this.app.listen(this.port, () => {
                const usedPort = (this.server.address() as AddressInfo).port;
                console.log(`express server open on port ${usedPort}`);
            });
        } else {
            console.log("no app has been setup yet");
        }

        return this;
    }
}
