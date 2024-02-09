import express from "express";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import {} from "solar-typing/src/solar"
import { Coordinates } from "solar-typing/src/general";
import { getGeocoding, getReverseGeocoding } from "@/services/util"

const utilRouter = express.Router();

utilRouter.get("/util/geocoding", async (req, res) => {
    const formattedAddress = req.query.address as string;
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

utilRouter.get("/util/reverse-geocoding", async (req, res) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    const formattedAddress: string | null = await getReverseGeocoding(coord); 

    if (formattedAddress !== null) {
        res.status(200).json({
            address: formattedAddress
        });
    } else {
        res.status(300).json(
            generalErrorResponse("something wrong happened")
        );
    }
});

export default utilRouter;