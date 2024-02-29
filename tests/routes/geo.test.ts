import { describe, test, assert, vi } from "vitest";
import request from "supertest"
import { ServerFactory } from "@/serverFactory";
import { dummyLatLng } from "geo-env-typing/geo";
import { UtilGenerator } from "geo-env-typing/generators/utilGenerators";
import { StringGenerator } from "geo-env-typing/generators/stringGenerator";

const { app } = ServerFactory.create().onTestEnvironnement().withDefaultValues().build();
const geo = await import("@/services/geo")
vi.mock("@/services/geo");

const ExpressGeocodingUrl = "/geo/geocoding";
const ExpressReverseGeocodingUrl = "/geo/reverse-geocoding";

describe(`GET ${ExpressGeocodingUrl}`, async () => {
    const dummyCoord = dummyLatLng();
    const dummyAddress = StringGenerator.generateSentence();

    test("whenRequestIsSucessfull, then returns 200 with coordinates", async () => {
        geo.getGeocoding = vi.fn().mockResolvedValue(dummyCoord);

        return request(app)
            .get(ExpressGeocodingUrl)
            .query(dummyAddress)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.coordinates, dummyCoord))
            })
    })

    test("whenRequestFails, then returns 500 with error message", () => {
        geo.getGeocoding = vi.fn()
            .mockImplementation(() => { throw "" })
            .mockRejectedValue({});

        return request(app)
            .get(ExpressGeocodingUrl)
            .query(dummyAddress)
            .expect(500)
            .then((response) => {
                assert.isTrue(response.body.error === "The request could not be resolved, the API endpoint encountered an error.")
            })
    })
});

describe(`GET ${ExpressReverseGeocodingUrl}`, async () => {
    const dummyCoord = dummyLatLng();
    const dummyAddress = StringGenerator.generateSentence();

    test("whenRequestIsSucessfull, then returns 200 with address", async () => {
        geo.getReverseGeocoding = vi.fn().mockResolvedValue(dummyAddress);

        return request(app)
            .get(ExpressReverseGeocodingUrl)
            .query(dummyCoord)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.address, dummyAddress))
            })
    })

    test("whenRequestFails, then returns 500 with error message", () => {
        geo.getReverseGeocoding = vi.fn()
            .mockImplementation(() => { throw "" })
            .mockRejectedValue({});

        return request(app)
            .get(ExpressReverseGeocodingUrl)
            .query(dummyCoord)
            .expect(500)
            .then((response) => {
                assert.isTrue(response.body.error === "The request could not be resolved, the API endpoint encountered an error.")
            })
    })
});