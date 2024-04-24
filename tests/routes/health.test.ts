import { describe, test, assert } from "vitest";
import request from "supertest";
import { serverFactory } from "./factory";
import { getAuthTokenForTest } from "../auth/auth";

const app = serverFactory.app;
const token = await getAuthTokenForTest();

describe(`GET /health`, async () => {
    const url = `/health`;

    test("when request is sucessfull, then returns 200 with server is up message", async () => {
        return request(app)
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                assert.isTrue(response.body.status === "server is up");
            });
    });
});
