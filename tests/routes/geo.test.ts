import { describe, test, assert } from "vitest";
import request from "supertest";
import { LatLng } from "geo-env-typing/geo";
import { serverFactory } from "@/index";
import { validCoordinates } from "geo-env-typing/geo"; 
import { getAuthTokenForTest } from "../auth/auth";

const app = serverFactory.app;
const token = await getAuthTokenForTest();

function getGeocodingEndpoint(address: string) {
    return `/geo/geocoding?${new URLSearchParams({ address: address }).toString()}`;
}

describe("GET /geo/geocoding", async () => {
    test("given white house address, when request is successfull, then returns 200 with valid coordinates", async () => {
        const endpoint = getGeocodingEndpoint("The White House");

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(validCoordinates(response.body.coordinates));
            });
    });

    test("given invalid address, when request fails, then returns 500 with api error", () => {
        const endpoint = getGeocodingEndpoint("THIS IS AN INVALID ADDRESS");

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
    });
});

function getReverseGeocodingEndpoint(coord: LatLng) {
    return `/geo/reverse-geocoding?${new URLSearchParams(coord as any).toString()}`;
}

describe("GET /geo/reverse-geocoding", async () => {
    test("given white house coordinates, when request is successfull, then returns 200 with valid, non-empty string", async () => {
        const endpoint = getReverseGeocodingEndpoint({
            lat: 38.8977,
            lng: 77.0365
        });

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(typeof response.body.address === "string");
                assert.isTrue(response.body.address !== "")
            });
    });

    test("given invalid coordinates, when request fails, then returns 400", () => {
        const endpoint = getReverseGeocodingEndpoint({
            lat: 1000,
            lng: 1000
        });

        return request(app)
            .get(endpoint)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    });
});
