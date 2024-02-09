import { GOOGLE_KEY } from "@/config";
import { Coordinates, validCoordinates } from "solar-typing/src/general"
import {} from "solar-typing/src/solar"
import { Client, GeocodeResponse, ReverseGeocodeResponse } from "@googlemaps/google-maps-services-js"

const client = new Client({});

export async function getGeocoding(formattedAddress: string) {
    let coord: Coordinates = { lat: 0, lng: 0 };
    await client.geocode(
        { 
            params: {
                key: GOOGLE_KEY,
                address: formattedAddress
            }
        }
    )
        .then((res: GeocodeResponse) => {
            coord.lat = res.data.results[0].geometry.location.lat;
            coord.lng = res.data.results[0].geometry.location.lng;
        })
        .catch((error) => {
            console.log(error);
        })

    if (validCoordinates(coord) && coord.lat != 0 && coord.lng != 0) {
        return coord;
    } else {
        console.log(coord)
        return null;
    }
}

export async function getReverseGeocoding(coord: Coordinates) {
    let formattedAddress: string | null = null;
    await client.reverseGeocode(
        { 
            params: {
                key: GOOGLE_KEY,
                latlng: coord
            }
        }
    )
        .then((res: ReverseGeocodeResponse) => {
            formattedAddress = res.data.results[0].formatted_address;
        })
        .catch((error) => {
            console.log(error);
        })

    return formattedAddress;    
}