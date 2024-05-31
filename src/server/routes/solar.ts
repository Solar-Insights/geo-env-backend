import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { getClosestBuildingInsights, getSolarLayers, getGeotiff } from "@/api/solar";
import { ApiError } from "@/server/utils/errors";
import { validateRequestCoordinates, authRequiredPermissions } from "@/server/middlewares/prerequests";
import compression from "compression";

const solarRouter = express.Router();

solarRouter.get(
    "/solar/closest-building-insights",
    authRequiredPermissions(["read:get-solar-data"]),
    validateRequestCoordinates,
    async (req, res, next) => {
        const coord: Coordinates = {
            lat: Number(req.query.lat),
            lng: Number(req.query.lng)
        };

        await getClosestBuildingInsights(coord)
            .then((data) => {
                res.status(200).locals.data = {
                    buildingInsights: data
                };
                next();
            })
            .catch((error) => {
                next(new ApiError(req.url));
            });
    }
);

solarRouter.get(
    "/solar/solar-layers",
    authRequiredPermissions(["read:get-solar-data"]),
    validateRequestCoordinates,
    async (req, res, next) => {
        const radius: number = Number(req.query.radius);
        const coord: Coordinates = {
            lat: Number(req.query.lat),
            lng: Number(req.query.lng)
        };

        await getSolarLayers(coord, radius)
            .then((data) => {
                res.status(200).locals.data = {
                    solarLayers: data
                };
                next();
            })
            .catch((error) => {
                next(new ApiError(req.url));
            });
    }
);

solarRouter.get(
    "/solar/geotiff",
    authRequiredPermissions(["read:get-solar-data"]),
    compression(),
    async (req, res, next) => {
        const url = decodeURIComponent(req.query.url as string);

        await getGeotiff(url)
            .then((data) => {
                res.status(200).locals.data = {
                    geotiff: data
                };
                next();
            })
            .catch((error) => {
                next(new ApiError(req.url));
            });
    }
);

export default solarRouter;
