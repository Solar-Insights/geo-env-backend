import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import { Coordinates } from "solar-typing/src/general";
import { BuildingInsights, GeoTiff, SolarLayers } from "solar-typing/src/solar";
import {
    getClosestBuildingInsights,
    getSolarLayers,
    getGeotiff,
} from "@/services/solar";

const solarRouter = express.Router();

solarRouter.get("/solar/closest-building-insights", async (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng),
    };

    await getClosestBuildingInsights(coord)
        .then((data) => {
            res.status(200).json({
                buildingInsights: data,
            });
        })
        .catch((error) => {
            error.type = "api-error";
            next(error);
        });
});

solarRouter.get("/solar/solar-layers", async (req, res, next) => {
    const radius: number = Number(req.query.radius);
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng),
    };

    const solarLayers: SolarLayers | null = await getSolarLayers(coord, radius);
    if (solarLayers !== null) {
        res.status(200).json({
            solarLayers: solarLayers,
        });
    } else {
        res.status(300).json(generalErrorResponse("something wrong happened"));
    }
});

solarRouter.get("/solar/geotiff", async (req, res, next) => {
    const url = decodeURIComponent(req.query.url as string);

    const geotiff: GeoTiff | null = await getGeotiff(url);
    if (geotiff !== null) {
        res.status(200).json({
            geotiff: geotiff,
        });
    } else {
        res.status(300).json(generalErrorResponse("something wrong happened"));
    }
});

export default solarRouter;
