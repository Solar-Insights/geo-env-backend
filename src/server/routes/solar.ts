import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { SolarApi } from "@/api/apis/solar";
import { validateRequestCoordinates, authRequiredPermissions } from "@/server/middlewares/prerequests";
import { BuildingInsights, SolarLayers, GeoTiff } from "geo-env-typing/solar";

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

        const buildingInsights: BuildingInsights = await solarApi.getClosestBuildingInsights(coord);

        res.status(200).locals.data = {
            buildingInsights: buildingInsights
        };
        next();
        return;
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

        const solarLayers: SolarLayers = await solarApi.getSolarLayers(coord, radius);

        res.status(200).locals.data = {
            solarLayers: solarLayers
        };
        next();
        return;
    }
);

solarRouter.get(
    "/solar/geotiff",
    authRequiredPermissions(["read:get-solar-data"]),
    async (req, res, next) => {
        const solarApi = new SolarApi(req);
        const url = decodeURIComponent(req.query.url as string);

        const geotiff: GeoTiff = await solarApi.getGeotiff(url);

        res.status(200).locals.data = {
            geotiff: geotiff
        };
        next();
    }
);

export default solarRouter;
