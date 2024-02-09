import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import { Coordinates } from "solar-typing/src/general"
import {} from "solar-typing/src/airQuality"
import { getAirQualityData } from "@/services/air";

const airRouter = express.Router();


airRouter.get("/", (req, res) => {
    console.log(1234);
    res.json({
        test: "test"
    });
});

airRouter.get("/air/air-quality-data", async (req, res) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    const airQualityData = await getAirQualityData(coord); 
    if (airQualityData !== null) {
        res.status(200).json({
            airQualityData: airQualityData
        });
    } else {
        res.status(300).json(
            generalErrorResponse("something wrong happened")
        );
    }
});

export default airRouter;
