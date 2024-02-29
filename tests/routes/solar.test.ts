import { describe, test, assert, vi } from "vitest";
import request from "supertest";
import nock from "nock";
import { ServerFactory } from "@/serverFactory";
import { GOOGLE_KEY } from "@/config";
import { dummyBuildingInsights, dummyGeoTiff, dummySolarLayers } from "geo-env-typing/solar";
import { dummyLatLng } from "geo-env-typing/geo";
import { UtilGenerator } from "geo-env-typing/generators/utilGenerators";
import { NumberGenerator } from "geo-env-typing/generators/numberGenerator";
import { ApiError } from "@/misc/customErrors";
import { StringGenerator } from "geo-env-typing/generators/stringGenerator";

const { app } = ServerFactory.create().onTestEnvironnement().withDefaultValues().build();
const solar = await import("@/misc/solar");
vi.mock("@/misc/solar");

const GoogleSolarApiUrl = "https://solar.googleapis.com/v1/";

describe(`GET /solar/closest-building-insights`, async () => {
    const dummyData = dummyBuildingInsights();
    const dummyCoord = dummyLatLng();
    const url = `/solar/closest-building-insights?${new URLSearchParams(dummyCoord as any).toString()}`;

    const nockInstance = nock(GoogleSolarApiUrl)
        .get("/buildingInsights:findClosest")
        .query({
            key: GOOGLE_KEY,
            "location.latitude": dummyCoord.lat.toFixed(5),
            "location.longitude": dummyCoord.lng.toFixed(5)
        });

    test("whenRequestIsSucessfull, then returns 200 with building insights", () => {
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.buildingInsights, dummyData));
            });
    });

    test("whenRequestFails, then returns 500 with api error", () => {
        const apiError = new ApiError(url);

        nockInstance.replyWithError(apiError);

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});

describe(`GET /solar/solar-layers`, async () => {
    const dummyData = dummySolarLayers();
    const dummyCoord = dummyLatLng();
    const radius = NumberGenerator.generateDouble(100);
    const params = {
        lat: dummyCoord.lat,
        lng: dummyCoord.lng,
        radius: radius
    };
    const url = `/solar/solar-layers?${new URLSearchParams(params as any).toString()}`;
    const apiError = new ApiError(url);

    const nockInstance = nock(GoogleSolarApiUrl)
        .get("/dataLayers:get")
        .query({
            key: GOOGLE_KEY,
            "location.latitude": dummyCoord.lat.toFixed(5),
            "location.longitude": dummyCoord.lng.toFixed(5),
            radiusMeters: radius.toString(),
            view: "FULL_LAYERS",
            requiredQuality: "HIGH"
        });

    test("whenRequestIsSucessfull, then returns 200 with solar layers", () => {
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.solarLayers, dummyData));
            });
    });

    test("whenRequestFails, then returns 500 with api error", () => {
        nockInstance.replyWithError(apiError);

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});

describe(`GET /solar/geotiff`, async () => {
    const dummyData = dummyGeoTiff();
    const dummyUrl = StringGenerator.generateUrl();
    const url = `/solar/geotiff?${new URLSearchParams({ url: dummyUrl }).toString()}`;
    const apiError = new ApiError(url);

    const nockInstance = nock(dummyUrl).get("/").query({ key: GOOGLE_KEY });

    test("whenRequestIsSucessfull, then returns 200 with geotiff", () => {
        solar.makeGeotiff = vi.fn().mockResolvedValue(dummyData);
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.geotiff, dummyData));
            });
    });

    test("whenRequestFails, then returns 500 with api error", () => {
        solar.makeGeotiff = vi.fn().mockResolvedValue(dummyData);
        nockInstance.replyWithError(apiError);

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });

    test("whenMakingGeotiffFails, then returns 500 with api error", () => {
        solar.makeGeotiff = vi
            .fn()
            .mockImplementation(() => {
                throw apiError;
            })
            .mockRejectedValue({});
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});
