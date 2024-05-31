import axios from "axios";
import { GOOGLE_KEY } from "@/server/utils/env";
import { LatLng } from "geo-env-typing/geo";
import { BuildingInsights, SolarLayers } from "geo-env-typing/solar";
import { makeGeotiff } from "@/server/services/solar";
import { ApiGeneric } from "@/api/utils/apiGeneric";
import { Request } from "express";
import { ApiError } from "@/api/utils/errors";

export class SolarApi extends ApiGeneric {
    public constructor(req: Request) {
        super(req);
    }

    public async getClosestBuildingInsights(coord: LatLng) {
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
            .catch(() => {
                throw new ApiError();
            });
    }

    public async getSolarLayers(coord: LatLng, radius: number) {
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
            .catch(() => {
                throw new ApiError();
            });
    }

    public async getGeotiff(url: string) {
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
            .catch(() => {
                throw new ApiError();
            });
    }
}