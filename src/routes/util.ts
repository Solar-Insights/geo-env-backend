import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import {} from "solar-typing/src/solar"
import { getGeocoding } from "@/services/util"
import { Coordinates } from "solar-typing/src/general";


const utilRouter = express.Router();

utilRouter.get("/util/geocoding/:formattedAddress", async (req, res) => {
    const formattedAddress = req.params.formattedAddress;
    const coord: Coordinates | null = await getGeocoding(formattedAddress); 

    if (coord !== null) {
        res.status(200).json({
            coordinates: coord
        });
    } else {
        res.status(300).json(
            generalErrorResponse("something wrong happened")
        );
    }
});

export default utilRouter;