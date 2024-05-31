import { GOOGLE_KEY } from "@/server/utils/env";
import { LatLng, validCoordinates } from "geo-env-typing/geo";
import { Client, GeocodeResponse, ReverseGeocodeResponse } from "@googlemaps/google-maps-services-js";
import { makeCoordinatesRangeError } from "@/server/utils/errors";
import { Request } from "express";
import { ApiGeneric } from "@/api/utils/apiGeneric";
import { ApiError } from "@/api/utils/errors";

export class GeoApi extends ApiGeneric {
    client: Client;

    public constructor(req: Request) {
        super(req);
        this.client = new Client({});
    }

    public async getGeocoding(formattedAddress: string) {
        return await this.client
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
                    throw makeCoordinatesRangeError();
                }
            })
            .catch(() => {
                throw new ApiError();
            });
    }

    public async getReverseGeocoding(coord: LatLng) {
        return await this.client
            .reverseGeocode({
                params: {
                    key: GOOGLE_KEY,
                    latlng: coord
                }
            })
            .then((res: ReverseGeocodeResponse) => {
                return res.data.results[0].formatted_address;
            })
            .catch(() => {
                throw new ApiError();
            });
    }
}