import express from "express";
import { Coordinates } from "solar-typing/src/general";
import { getGeocoding, getReverseGeocoding } from "@/services/util";

const utilRouter = express.Router();

utilRouter.get("/util/geocoding", async (req, res, next) => {
    const formattedAddress = req.query.address as string;

    await getGeocoding(formattedAddress)
        .then((data) => {
            res.status(200).json({
                coordinates: data
            });
        })
        .catch((error) => {
            error.type = "api-error";
            next(error);
        });
});

utilRouter.get("/util/reverse-geocoding", async (req, res, next) => {
    const coord: Coordinates = {
        lat: Number(req.query.lat),
        lng: Number(req.query.lng)
    };

    await getReverseGeocoding(coord)
        .then((data) => {
            res.status(200).json({
                address: data
            });
        })
        .catch((error) => {
            error.type = "api-error";
            next(error);
        });
});

export default utilRouter;
