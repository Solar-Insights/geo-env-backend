import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { getAirQualityData } from "@/api/air";
import { ApiError } from "@/middlewares/customErrors";
import { validateRequestCoordinates } from "@/middlewares/requestValidators";

const airRouter = express.Router();

airRouter.get("/", (req, res, next) => {
    res.json({
        body: "this server is currently working!"
    });
});

airRouter.get("/air/air-quality-data", validateRequestCoordinates, async (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    await getAirQualityData(coord)
        .then((data) => {
            res.status(200).json({
                airQualityData: data
            });
        })
        .catch((error) => {
            next(new ApiError(req.url));
        });
});

export default airRouter;
