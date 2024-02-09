import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import { Coordinates } from "solar-typing/src/general"
import {} from "solar-typing/src/solar"
import { getClosestBuildingInsights } from "@/services/solar"

const solarRouter = express.Router();

solarRouter.get("/solar/closest-building-insights", async (req, res) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    const buildingInsights = await getClosestBuildingInsights(coord); 
    if (buildingInsights !== null) {
        res.status(200).json({
            buildingInsights: buildingInsights
        });
    } else {
        res.status(300).json(
            generalErrorResponse("something wrong happened")
        );
    }
});

export default solarRouter;
