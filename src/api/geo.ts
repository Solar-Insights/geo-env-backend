import { GOOGLE_KEY } from "@/config";
import { LatLng, validCoordinates } from "geo-env-typing/geo";
import { Client, GeocodeResponse, ReverseGeocodeResponse } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function getGeocoding(formattedAddress: string) {
    return await client
        .geocode({
            params: {
                key: GOOGLE_KEY,
                address: formattedAddress
            }
        })
        .then((res: GeocodeResponse) => {
            const coord: LatLng = {
                lat: res.data.results[0].geometry.location.lat,
                lng: res.data.results[0].geometry.location.lng
            };
            if (validCoordinates(coord) && coord.lat != 0 && coord.lng != 0) {
                return coord;
            } else {
                throw new RangeError("Coordinates are not within of the permissible range of values");
            }
        })
        .catch((error) => {
            throw error;
        });
}

export async function getReverseGeocoding(coord: LatLng) {
    return await client
        .reverseGeocode({
            params: {
                key: GOOGLE_KEY,
                latlng: coord
            }
        })
        .then((res: ReverseGeocodeResponse) => {
            return res.data.results[0].formatted_address;
        })
        .catch((error) => {
            throw error;
        });
}
