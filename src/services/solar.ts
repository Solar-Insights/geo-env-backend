import axios from "axios"
import { GOOGLE_KEY } from "@/config";
import { Coordinates } from "solar-typing/src/general"
import { BuildingInsights } from "solar-typing/src/solar"
import { Client, } from "@googlemaps/google-maps-services-js"

const client = new Client({});

export async function getClosestBuildingInsights(coord: Coordinates) {
    // https://developers.google.com/maps/documentation/solar/reference/rest/v1/buildingInsights/findClosest
    return await axios({
        method: "get",
        responseType: 'json',
        url: "https://solar.googleapis.com/v1/buildingInsights:findClosest",
        params: {
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5)
        }
    })
        .then((response) => {
            return response.data as BuildingInsights;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}