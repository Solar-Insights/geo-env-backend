import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import { Coordinates } from "solar-typing/src/general";
import {} from "solar-typing/src/airQuality";
import { getAirQualityData } from "@/services/air";

const airRouter = express.Router();

airRouter.get("/", (req, res, next) => {
    res.json({
        body: "this server is currently working!",
    });
});

airRouter.get("/air/air-quality-data", async (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng),
    };

    await getAirQualityData(coord)
        .then((data) => {
            res.status(200).json({
                airQualityData: data,
            });
        })
        .catch((error) => {
            error.type = "api-error";
            next(error);
        });
});

export default airRouter;
