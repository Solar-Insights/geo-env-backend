import { describe, test, assert, vi } from "vitest";
import request from "supertest";
import { ServerFactory } from "@/serverFactory";
import { dummyLatLng } from "geo-env-typing/geo";
import { UtilGenerator, StringGenerator } from "geo-env-typing/generators";
import { ApiError } from "@/middlewares/customErrors";

const { app } = ServerFactory.create().onTestEnvironnement().withDefaultValues().build();
const geo = await import("@/api/geo");
vi.mock("@/services/geo");

describe("GET /geo/geocoding", async () => {
    const dummyCoord = dummyLatLng();
    const dummyAddress = StringGenerator.generateWord();
    const url = `/geo/geocoding?${new URLSearchParams({ address: dummyAddress }).toString()}`;
    const apiError = new ApiError(url);

    test("whenRequestIsSucessfull, then returns 200 with coordinates", async () => {
        geo.getGeocoding = vi.fn().mockResolvedValue(dummyCoord);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.coordinates, dummyCoord));
            });
    });

    test("whenRequestFails, then returns 500 with api error", () => {
        geo.getGeocoding = vi
            .fn()
            .mockImplementation(() => {
                throw apiError;
            })
            .mockRejectedValue({});

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});

describe("GET /geo/reverse-geocoding", async () => {
    const dummyCoord = dummyLatLng();
    const dummyAddress = StringGenerator.generateSentence();
    const url = `/geo/reverse-geocoding?${new URLSearchParams(dummyCoord as any).toString()}`;
    const apiError = new ApiError(url);

    test("whenRequestIsSucessfull, then returns 200 with address", async () => {
        geo.getReverseGeocoding = vi.fn().mockResolvedValue(dummyAddress);

        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.address, dummyAddress));
            });
    });

    test("whenRequestFails, then returns 500 with api error", () => {
        geo.getReverseGeocoding = vi
            .fn()
            .mockImplementation(() => {
                throw apiError;
            })
            .mockRejectedValue({});

        return request(app)
            .get(url)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});
