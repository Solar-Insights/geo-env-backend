import axios from "axios"
import { GOOGLE_KEY } from "@/config";
import { Coordinates } from "solar-typing/src/general"
import { BuildingInsights, LayerId, Layer, SolarLayers } from "solar-typing/src/solar"

import { Client, } from "@googlemaps/google-maps-services-js"
import { downloadGeoTIFF, renderPalette } from "@/misc/solar";
import { ironPalette, sunlightPalette} from "@/misc/constants";

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

export async function getSolarLayers(coord: Coordinates, radius: number) {
    // https://developers.google.com/maps/documentation/solar/data-layers
    return await axios({
        method: "get",
        responseType: 'json',
        url: "https://solar.googleapis.com/v1/dataLayers:get",
        params: {
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5),
            radiusMeters: radius.toString(),
            view: "FULL_LAYERS",
            requiredQuality: "HIGH",
        }
    })
        .then((response) => {
            return response.data as SolarLayers;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

export async function getSingleSolarLayer(layerId: LayerId, urls: SolarLayers) {
    const get: Record<LayerId, () => Promise<Layer>> = {
        annualFlux: async () => {
            const [mask, data] = await Promise.all([
                downloadGeoTIFF(urls.maskUrl),
                downloadGeoTIFF(urls.annualFluxUrl),
            ]);
            const colors = ironPalette;
            return {
                id: layerId,
                bounds: mask.bounds,
                palette: {
                    colors: colors,
                    min: "Shady",
                    max: "Sunny",
                },
                render: (showRoofOnly) => [
                    renderPalette({
                        data: data,
                        mask: showRoofOnly ? mask : undefined,
                        colors: colors,
                        min: 0,
                        max: 1800,
                    }),
                ],
            };
        },
        monthlyFlux: async () => {
            const [mask, data] = await Promise.all([
                downloadGeoTIFF(urls.maskUrl),
                downloadGeoTIFF(urls.monthlyFluxUrl),
            ]);
            const colors = ironPalette;
            return {
                id: layerId,
                bounds: mask.bounds,
                palette: {
                    colors: colors,
                    min: "Shady",
                    max: "Sunny",
                },
                render: (showRoofOnly) =>
                    [...Array(12).keys()].map((month) =>
                        renderPalette({
                            data: data,
                            mask: showRoofOnly ? mask : undefined,
                            colors: colors,
                            min: 0,
                            max: 200,
                            index: month,
                        }),
                    ),
            };
        },
        hourlyShade: async () => {
            const [mask, ...months] = await Promise.all([
                downloadGeoTIFF(urls.maskUrl),
                ...urls.hourlyShadeUrls.map((url) => downloadGeoTIFF(url)),
            ]);
            const colors = sunlightPalette;
            return {
                id: layerId,
                bounds: mask.bounds,
                palette: {
                    colors: colors,
                    min: "Shade",
                    max: "Sun",
                },
                render: (showRoofOnly, month, day) =>
                    [...Array(24).keys()].map((hour) =>
                        renderPalette({
                            data: {
                                ...months[month],
                                rasters: months[month].rasters.map((values) => values.map((x) => x & (1 << (day - 1)))),
                            },
                            mask: showRoofOnly ? mask : undefined,
                            colors: colors,
                            min: 0,
                            max: 1,
                            index: hour,
                        }),
                    ),
            };
        },
    };
}