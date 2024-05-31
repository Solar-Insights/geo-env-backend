import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { SolarApi } from "@/api/apis/solar";
import { validateRequestCoordinates, authRequiredPermissions } from "@/server/middlewares/prerequests";
import compression from "compression";

const solarRouter = express.Router();

solarRouter.get(
    "/solar/closest-building-insights",
    authRequiredPermissions(["read:get-solar-data"]),
    validateRequestCoordinates,
    async (req, res, next) => {
        const solarApi = new SolarApi(req);
        const coord: Coordinates = {
            lat: Number(req.query.lat),
            lng: Number(req.query.lng)
        };

        await solarApi.getClosestBuildingInsights(coord)
            .then((buildingInsights) => {
                res.status(200).locals.data = {
                    buildingInsights: buildingInsights
                };
                next();
            })
    }
);

solarRouter.get(
    "/solar/solar-layers",
    authRequiredPermissions(["read:get-solar-data"]),
    validateRequestCoordinates,
    async (req, res, next) => {
        const solarApi = new SolarApi(req);
        const radius: number = Number(req.query.radius);
        const coord: Coordinates = {
            lat: Number(req.query.lat),
            lng: Number(req.query.lng)
        };

        await solarApi.getSolarLayers(coord, radius)
            .then((solarLayers) => {
                res.status(200).locals.data = {
                    solarLayers: solarLayers
                };
                next();
            })
    }
);

solarRouter.get(
    "/solar/geotiff",
    authRequiredPermissions(["read:get-solar-data"]),
    compression(),
    async (req, res, next) => {
        const solarApi = new SolarApi(req);
        const url = decodeURIComponent(req.query.url as string);

        await solarApi.getGeotiff(url)
            .then((geotiff) => {
                res.status(200).locals.data = {
                    geotiff: geotiff
                };
                next();
            })
    }
);

export default solarRouter;
