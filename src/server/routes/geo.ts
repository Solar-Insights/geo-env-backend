import express from "express";
import { Coordinates, LatLng } from "geo-env-typing/geo";
import { GeoApi } from "@/api/apis/geo";
import { validateRequestCoordinates, authRequiredPermissions } from "@/server/middlewares/prerequests";

const geoRouter = express.Router();

geoRouter.get("/geo/geocoding", authRequiredPermissions(["read:get-geo-data"]), async (req, res, next) => {
    const geoApi = new GeoApi(req);
    const formattedAddress = req.query.address as string;

    await geoApi.getGeocoding(formattedAddress)
        .then((coordinates) => {
            res.status(200).locals.data = {
                coordinates: coordinates
            };
            next();
        });
});

geoRouter.get(
    "/geo/reverse-geocoding",
    authRequiredPermissions(["read:get-geo-data"]),
    validateRequestCoordinates,
    async (req, res, next) => {
        const geoApi = new GeoApi(req);
        const coord: Coordinates = {
            lat: Number(req.query.lat),
            lng: Number(req.query.lng)
        };

        await geoApi.getReverseGeocoding(coord)
            .then((address) => {
                res.status(200).locals.data = {
                    address: address
                };
                next();
            });
    }
);

export default geoRouter;
