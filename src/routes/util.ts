import express from "express";
import { GOOGLE_KEY } from "@/config";
import { generalErrorResponse } from "@/errorHandling/errorResponse";
import { Coordinates, validCoordinates } from "solar-typing/src/general"
import {} from "solar-typing/src/solar"
import { Client, GeocodeResponse } from "@googlemaps/google-maps-services-js"

const client = new Client({});
const router = express.Router();

router.get("/util/geocoding/:formattedAddress", async (req, res) => {
    const formattedAddress = req.params.formattedAddress;
    const coord: Coordinates = { lat: 0, lng: 0 };
    await client.geocode(
        { 
            params: {
                key: GOOGLE_KEY,
                address: formattedAddress
            }
        }
    )
        .then((geocodingRequest: GeocodeResponse) => {
            coord.lat = geocodingRequest.data.results[0].geometry.location.lat;
            coord.lng = geocodingRequest.data.results[0].geometry.location.lng;
        })
        .catch((error) => {
            console.log(error);
        })

    if (validCoordinates(coord) && coord.lat != 0 && coord.lng != 0) {
        res.status(200).json({
            coordinates: coord
        });
    } else {
        console.log(coord)
        res.status(300).json(
            generalErrorResponse("something wrong happened")
        );
    }
});







export default router;