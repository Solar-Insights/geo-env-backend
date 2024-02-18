import axios from "axios";
import { GOOGLE_KEY } from "@/config";
import { Coordinates } from "geo-env-typing/geo";
import { BuildingInsights, SolarLayers } from "geo-env-typing/solar";
import { Client } from "@googlemaps/google-maps-services-js";
import { makeGeotiff } from "@/misc/solar";

const client = new Client({});

export async function getClosestBuildingInsights(coord: Coordinates) {
    // https://developers.google.com/maps/documentation/solar/reference/rest/v1/buildingInsights/findClosest
    return await axios({
        method: "get",
        responseType: "json",
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
            throw error;
        });
}

export async function getSolarLayers(coord: Coordinates, radius: number) {
    // https://developers.google.com/maps/documentation/solar/data-layers
    return await axios({
        method: "get",
        responseType: "json",
        url: "https://solar.googleapis.com/v1/dataLayers:get",
        params: {
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5),
            radiusMeters: radius.toString(),
            view: "FULL_LAYERS",
            requiredQuality: "HIGH"
        }
    })
        .then((response) => {
            return response.data as SolarLayers;
        })
        .catch((error) => {
            throw error;
        });
}

export async function getGeotiff(url: string) {
    return await axios({
        method: "get",
        responseType: "arraybuffer",
        url: url,
        params: {
            key: GOOGLE_KEY
        }
    })
        .then(async (response) => {
            return await makeGeotiff(response);
        })
        .catch((error) => {
            throw error;
        });
}
