import { describe, test, assert, vi } from "vitest";
import request from "supertest";
import nock from "nock";
import { GOOGLE_KEY } from "@/config";
import { dummyBuildingInsights, dummyGeoTiff, dummySolarLayers } from "geo-env-typing/solar";
import { dummyLatLng, LatLng } from "geo-env-typing/geo";
import { UtilGenerator, NumberGenerator, StringGenerator } from "geo-env-typing/generators";
import { ApiError } from "@/middlewares/customErrors";
import { serverFactory } from "./factory";
import { getAuthTokenForTest } from "../auth/auth";
import { makeInvalidCoordError } from "@/middlewares/requestHandlers";

const app = serverFactory.app;
const token = await getAuthTokenForTest();

const GoogleSolarApiUrl = "https://solar.googleapis.com/v1/";
const solar = await import("@/services/solar");
vi.mock("@/services/solar");


function getClosestBuildingInsightsEndpoint(coord: LatLng) {
    return `/solar/closest-building-insights?${new URLSearchParams(coord as any).toString()}`;
}

function getBuildingInsightsNockInstance(coord: LatLng) {
    return nock(GoogleSolarApiUrl)
        .get("/buildingInsights:findClosest")
        .query({
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5)
        });
}

describe(`GET /solar/closest-building-insights`, async () => {
    test("given valid coordinates, when request is successfull, then returns 200 with building insights", async () => {
        const dummyData = dummyBuildingInsights();
        const dummyCoord = dummyLatLng();
        const endpoint = getClosestBuildingInsightsEndpoint(dummyCoord);

        const nockInstance = getBuildingInsightsNockInstance(dummyCoord)
        nockInstance.reply(200, dummyData);

        return await request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.buildingInsights, dummyData));
            });
    });

    test("given error on api call, when request fails, then returns 500 with api error", async () => {
        const dummyCoord = dummyLatLng();
        const endpoint = getClosestBuildingInsightsEndpoint(dummyCoord);

        const apiError = new ApiError(endpoint);
        const nockInstance = getBuildingInsightsNockInstance(dummyCoord)
        nockInstance.replyWithError(apiError);

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });

    test("given invalid coordinates, when request fails, then returns 400 with invalid parameter error", async () => {
        const dummyData = dummyBuildingInsights();
        const dummyCoord = { lat: 1000, lng: 1000 };
        const endpoint = getClosestBuildingInsightsEndpoint(dummyCoord);

        const nockInstance = getBuildingInsightsNockInstance(dummyCoord)
        nockInstance.reply(200, dummyData);

        return await request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, makeInvalidCoordError(endpoint).toObject()));
            });
    });
});


function getSolarLayersEndpoint(params: any) {
    return `/solar/solar-layers?${new URLSearchParams(params as any).toString()}`;
}

function getSolarLayersNockInstance(coord: LatLng, radius: number) {
    return nock(GoogleSolarApiUrl)
        .get("/dataLayers:get")
        .query({
            key: GOOGLE_KEY,
            "location.latitude": coord.lat.toFixed(5),
            "location.longitude": coord.lng.toFixed(5),
            radiusMeters: radius.toString(),
            view: "FULL_LAYERS",
            requiredQuality: "HIGH"
        });
}

describe(`GET /solar/solar-layers`, async () => {
    const radius = NumberGenerator.generateDouble(100);

    test("given valid coordinates, when request is successfull, then returns 200 with solar layers", () => {
        const dummyData = dummySolarLayers();
        const dummyCoord = dummyLatLng();
        const endpoint = getSolarLayersEndpoint({ lat: dummyCoord.lat, lng: dummyCoord.lng, radius: radius});

        const nockInstance = getSolarLayersNockInstance(dummyCoord, radius);
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.solarLayers, dummyData));
            });
    });

    test("given error on api call, when request fails, then returns 500 with api error", () => {
        const dummyData = dummySolarLayers();
        const dummyCoord = dummyLatLng();
        const endpoint = getSolarLayersEndpoint({ lat: dummyCoord.lat, lng: dummyCoord.lng, radius: radius});

        const apiError = new ApiError(endpoint);
        const nockInstance = getSolarLayersNockInstance(dummyCoord, radius);
        nockInstance.replyWithError(apiError);

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});


function getSolarGeotiffEndpoint(url: string) {
    return `/solar/geotiff?${new URLSearchParams({ url: url }).toString()}`;
}

function getGeotiffNockInstance(url: string) {
    return nock(url)
        .get("/")
        .query({ key: GOOGLE_KEY });
}

describe(`GET /solar/geotiff`, async () => {
    test("when request is successfull, then returns 200 with geotiff", async () => {
        const dummyData = dummyGeoTiff();
        const dummyUrl = StringGenerator.generateUrl();
        const endpoint = getSolarGeotiffEndpoint(dummyUrl);

        solar.makeGeotiff = vi
            .fn()
            .mockResolvedValue(dummyData);
        const nockInstance = getGeotiffNockInstance(dummyUrl);
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.geotiff, dummyData));
            });
    });

    test("when request fails, then returns 500 with api error", () => {
        const dummyData = dummyGeoTiff();
        const dummyUrl = StringGenerator.generateUrl();
        const endpoint = getSolarGeotiffEndpoint(dummyUrl);

        solar.makeGeotiff = vi
            .fn()
            .mockResolvedValue(dummyData);
        const apiError = new ApiError(endpoint);
        const nockInstance = getGeotiffNockInstance(dummyUrl);
        nockInstance.replyWithError(apiError);
        
        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });

    test("when making geotiff fails, then returns 500 with api error", async () => {
        const dummyData = dummyGeoTiff();
        const dummyUrl = StringGenerator.generateUrl();
        const endpoint = getSolarGeotiffEndpoint(dummyUrl);

        solar.makeGeotiff = vi
            .fn()
            .mockImplementation(() => {
                throw apiError;
            })
            .mockRejectedValue({});
        const apiError = new ApiError(endpoint);
        const nockInstance = getGeotiffNockInstance(dummyUrl);
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});
