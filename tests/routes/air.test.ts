import { describe, test, assert } from "vitest";
import request from "supertest"
import nock from "nock";

import { ServerFactory } from "../../src/serverFactory";
import {  GOOGLE_KEY } from "../../src/config";
import { dummyAirQualityData } from "geo-env-typing/air";
import { dummyLatLng } from "geo-env-typing/geo";
import { UtilGenerator } from "geo-env-typing/generators/utilGenerators";

const { app, server } = ServerFactory.create().withDefaultValues().build();
const GoogleAirApiUrl = "https://airquality.googleapis.com/v1/";
const ExpressGetAirQualityDataUrl = "/air/air-quality-data";

describe(`GET ${ExpressGetAirQualityDataUrl}`, async () => {
    const dummyData = dummyAirQualityData()
    const dummyCoord = dummyLatLng();
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
        .query({ key: GOOGLE_KEY })
    
    test("whenMakingRequestWithValidParameters, then returns 200 with air quality data", () => {
        nockInstance.reply(200, dummyData);
    
        return request(app)
            .get(ExpressGetAirQualityDataUrl)
            .query(dummyCoord)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.airQualityData, dummyData))
            })
    })

    test("whenMakingRequestWithThatFails, then returns 500 with api-error type", () => {
        nockInstance.replyWithError("");
    
        return request(app)
            .get(ExpressGetAirQualityDataUrl)
            .query(dummyCoord)
            .expect(500)
            .catch((error) => {
                assert.isTrue(error.type === "api-error");
            })
    })
});
