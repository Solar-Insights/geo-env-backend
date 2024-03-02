import { describe, test, assert } from "vitest";
import request from "supertest";
import { ServerFactory } from "@/serverFactory";

const { app } = ServerFactory.create().onTestEnvironnement().withDefaultValues().build();

describe(`GET /health`, async () => {
    const url = `/health`;

    test("whenRequestIsSucessfull, then returns 200 with server is up message", () => {
        return request(app)
            .get(url)
            .expect(200)
            .then((response) => {
                assert.isTrue(response.body.status === "server is up");
            });
    });
});
