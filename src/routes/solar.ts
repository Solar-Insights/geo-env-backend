import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { getClosestBuildingInsights, getSolarLayers, getGeotiff } from "@/api/solar";
import { ApiError } from "@/middlewares/customErrors";
import { validateRequestCoordinates, authRequiredPermissions, userRequestLogger } from "@/middlewares/requestHandlers";

const solarRouter = express.Router();

solarRouter.get("/solar/closest-building-insights", authRequiredPermissions(["read:solar-data"]), validateRequestCoordinates, userRequestLogger, async (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    await getClosestBuildingInsights(coord)
        .then((data) => {
            res.status(200).json({
                buildingInsights: data
            });
        })
        .catch((error) => {
            next(new ApiError(req.url));
        });
});

solarRouter.get("/solar/solar-layers", authRequiredPermissions(["read:solar-data"]), validateRequestCoordinates, userRequestLogger, async (req, res, next) => {
    const radius: number = Number(req.query.radius);
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    await getSolarLayers(coord, radius)
        .then((data) => {
            res.status(200).json({
                solarLayers: data
            });
        })
        .catch((error) => {
            next(new ApiError(req.url));
        });
});

solarRouter.get("/solar/geotiff", authRequiredPermissions(["read:solar-data"]), userRequestLogger, async (req, res, next) => {
    const url = decodeURIComponent(req.query.url as string);

    await getGeotiff(url)
        .then((data) => {
            res.status(200).json({
                geotiff: data
            });
        })
        .catch((error) => {
            next(new ApiError(req.url));
        });
});

export default solarRouter;
