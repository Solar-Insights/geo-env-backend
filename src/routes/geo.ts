import express from "express";
import { Coordinates } from "geo-env-typing/geo";
import { getGeocoding, getReverseGeocoding } from "@/api/geo";
import { ApiError } from "@/middlewares/customErrors";
import { validateRequestCoordinates, authRequiredPermissions, userRequestLogger } from "@/middlewares/requestHandlers";

const geoRouter = express.Router();

geoRouter.get(
    "/geo/geocoding",
    authRequiredPermissions(["read:geo-data"]),
    userRequestLogger,
    async (req, res, next) => {
        const formattedAddress = req.query.address as string;

        await getGeocoding(formattedAddress)
            .then((data) => {
                res.status(200).json({
                    coordinates: data
                });
            })
            .catch((error) => {
                next(new ApiError(req.url));
            });
    }
);

geoRouter.get(
    "/geo/reverse-geocoding",
    authRequiredPermissions(["read:geo-data"]),
    validateRequestCoordinates,
    userRequestLogger,
    async (req, res, next) => {
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
                next(new ApiError(req.url));
            });
    }
);

export default geoRouter;
