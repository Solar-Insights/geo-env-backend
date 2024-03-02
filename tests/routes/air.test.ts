import { describe, test, assert } from "vitest";
import request from "supertest";
import nock from "nock";
import { ServerFactory } from "@/serverFactory";
import { GOOGLE_KEY } from "@/config";
import { dummyAirQualityData } from "geo-env-typing/air";
import { dummyLatLng } from "geo-env-typing/geo";
import { UtilGenerator } from "geo-env-typing/generators";
import { ApiError } from "@/misc/customErrors";

const { app } = ServerFactory.create().onTestEnvironnement().withDefaultValues().build();

const GoogleAirApiUrl = "https://airquality.googleapis.com/v1/";

describe(`GET /air/air-quality-data`, async () => {
    const dummyData = dummyAirQualityData();
    const dummyCoord = dummyLatLng();
    const url = `/air/air-quality-data?${new URLSearchParams(dummyCoord as any).toString()}`;
    const apiError = new ApiError(url);

    const nockInstance = nock(GoogleAirApiUrl)
        .post("/currentConditions:lookup", {
            location: {
                latitude: dummyCoord.lat,
                longitude: dummyCoord.lng
            },
            universalAqi: true,
            extraComputations: [
                "DOMINANT_POLLUTANT_CONCENTRATION",
                "POLLUTANT_CONCENTRATION",
                "POLLUTANT_ADDITIONAL_INFO",
                "HEALTH_RECOMMENDATIONS"
            ]
        })
        .query({ key: GOOGLE_KEY });

    test("whenRequestIsSucessfull, then returns 200 with air quality data", () => {
        nockInstance.reply(200, dummyData);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.airQualityData, dummyData));
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
