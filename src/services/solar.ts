import axios from "axios";
import { GOOGLE_KEY } from "@/config";
import { Coordinates } from "solar-typing/src/general";
import {
    BuildingInsights,
    LayerId,
    Layer,
    SolarLayers,
    GeoTiff,
} from "solar-typing/src/solar";

import { Client } from "@googlemaps/google-maps-services-js";
import { renderPalette } from "@/misc/solar";
import { ironPalette, sunlightPalette } from "@/misc/constants";
import * as geotiff from "geotiff";
import geokeysToProj4 from "geotiff-geokeys-to-proj4";
import proj4 from "proj4";

const client = new Client({});

export async function getClosestBuildingInsights(coord: Coordinates) {
    // https://developers.google.com/maps/documentation/solar/reference/rest/v1/buildingInsights/findClosest
    return await axios({
        method: "get",
        responseType: "json",
        url: "https://solar.googleapis.com/v1/buildingInsights:",
        params: {
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5),
        },
    })
        .then((response) => {
            return response.data as BuildingInsights;
        })
        .catch((err) => {
            throw(err);
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
            requiredQuality: "HIGH",
        },
    })
        .then((response) => {
            return response.data as SolarLayers;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

export async function getGeotiff(url: string) {
    return await axios({
        method: "get",
        responseType: "arraybuffer",
        url: url,
        params: {
            key: GOOGLE_KEY,
        },
    })
        .then(async (response) => {
            const buffer: Buffer = response.data;
            const arraybuffer: ArrayBuffer = buffer.buffer.slice(
                buffer.byteOffset,
                buffer.byteOffset + buffer.byteLength,
            );

            const tiff = await geotiff.fromArrayBuffer(arraybuffer);
            const image = await tiff.getImage();
            const rasters = await image.readRasters();

            const geoKeys = image.getGeoKeys();

            const projObj = geokeysToProj4.toProj4(geoKeys);
            const projection = proj4(projObj.proj4, "WGS84");
            const box = image.getBoundingBox();
            const sw = projection.forward({
                x: box[0] * projObj.coordinatesConversionParameters.x,
                y: box[1] * projObj.coordinatesConversionParameters.y,
            });
            const ne = projection.forward({
                x: box[2] * projObj.coordinatesConversionParameters.x,
                y: box[3] * projObj.coordinatesConversionParameters.y,
            });

            return {
                width: rasters.width,
                height: rasters.height,
                rasters: [...Array(rasters.length).keys()].map((i) =>
                    Array.from(rasters[i] as geotiff.TypedArray),
                ),
                bounds: {
                    north: ne.y,
                    south: sw.y,
                    east: ne.x,
                    west: sw.x,
                },
            } as GeoTiff;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}
