import axios from "axios";
import { GOOGLE_KEY } from "@/config";
import { LatLng } from "geo-env-typing/geo";
import { AirQualityData } from "geo-env-typing/air";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function getAirQualityData(coord: LatLng) {
    // https://developers.google.com/maps/documentation/air-quality/reference/rest/v1/currentConditions/lookup#request-body
    return await axios({
        method: "post",
        responseType: "json",
        url: "https://airquality.googleapis.com/v1/currentConditions:lookup",
        params: {
            key: GOOGLE_KEY
        },
        data: {
            location: {
                latitude: coord.lat,
                longitude: coord.lng
            },
            universalAqi: true,
            extraComputations: [
                "DOMINANT_POLLUTANT_CONCENTRATION",
                "POLLUTANT_CONCENTRATION",
                "POLLUTANT_ADDITIONAL_INFO",
                "HEALTH_RECOMMENDATIONS"
            ]
        }
    })
        .then((response) => {
            return response.data as AirQualityData;
        })
        .catch((error) => {
            throw error;
        });
}
