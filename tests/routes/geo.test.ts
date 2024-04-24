import { describe, test, assert, vi } from "vitest";
import request from "supertest";
import { LatLng } from "geo-env-typing/geo";
import { serverFactory } from "./factory";
import { validCoordinates } from "geo-env-typing/geo";
import { getAuthTokenForTest } from "../auth/auth";
import { ApiError } from "@/middlewares/customErrors";
import { UtilGenerator } from "geo-env-typing/generators";
import { makeInvalidCoordError } from "@/middlewares/requestHandlers";
import { makeCoordinatesRangeError, rangeErrorToObject } from "@/middlewares/customErrors";

const app = serverFactory.app;
const token = await getAuthTokenForTest();

const geo = await import("@/api/geo");
vi.mock("@/api/geo");

const WHITE_HOUSE_ADDRESS = "The White House";
const WHITE_HOUSE_COORDINATES: LatLng = {
    lat: 38.8977,
    lng: 77.0365
};

function getGeocodingEndpoint(address: string) {
    return `/geo/geocoding?${new URLSearchParams({ address: address }).toString()}`;
}

describe("GET /geo/geocoding", async () => {
    test("given white house address, when request is successfull, then returns 200 with valid coordinates", async () => {
        const endpoint = getGeocodingEndpoint(WHITE_HOUSE_ADDRESS);
        geo.getGeocoding = vi.fn().mockResolvedValue(WHITE_HOUSE_COORDINATES);

        return request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body.coordinates, WHITE_HOUSE_COORDINATES));
                assert.isTrue(validCoordinates(response.body.coordinates));
            });
    });

    test("given white house address, when request returns invalid coordinates, then returns 500", async () => {
        const endpoint = getGeocodingEndpoint(WHITE_HOUSE_ADDRESS);
        const rangeError = makeCoordinatesRangeError();
        geo.getGeocoding = vi
            .fn()
            .mockImplementation(() => {
                throw rangeError;
            })
            .mockRejectedValue({});

        return request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, new ApiError(endpoint).toObject()));
            });
    });

    test("given invalid address, when request fails, then returns 500 with api error", () => {
        const endpoint = getGeocodingEndpoint("THIS IS AN INVALID ADDRESS");
        const apiError = new ApiError(endpoint);
        geo.getGeocoding = vi
            .fn()
            .mockImplementation(() => {
                throw apiError;
            })
            .mockRejectedValue({});

        return request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(500)
            .then((response) => {
                assert.isTrue(UtilGenerator.identicalJsonStrings(response.body, apiError.toObject()));
            });
    });
});

function getReverseGeocodingEndpoint(coord: LatLng) {
    return `/geo/reverse-geocoding?${new URLSearchParams(coord as any).toString()}`;
}

describe("GET /geo/reverse-geocoding", async () => {
    test("given white house coordinates, when request is successfull, then returns 200 with valid, valid string", async () => {
        const endpoint = getReverseGeocodingEndpoint(WHITE_HOUSE_COORDINATES);
        geo.getReverseGeocoding = vi.fn().mockResolvedValue(WHITE_HOUSE_ADDRESS);

        return await request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(response.body.address === WHITE_HOUSE_ADDRESS);
            });
    });

    test("given missing coordinates, when request fails, then returns 400", async () => {
        const endpoint = getReverseGeocodingEndpoint(undefined as any);

        return await request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .then((response) => {
                assert.isTrue(
                    UtilGenerator.identicalJsonStrings(response.body, makeInvalidCoordError(endpoint).toObject())
                );
            });
    });

    test("given invalid coordinates, when request fails, then returns 400", async () => {
        const endpoint = getReverseGeocodingEndpoint({
            lat: 1000,
            lng: 1000
        });

        return await request(app)
            .get(endpoint)
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .then((response) => {
                assert.isTrue(
                    UtilGenerator.identicalJsonStrings(response.body, makeInvalidCoordError(endpoint).toObject())
                );
            });
    });
});
