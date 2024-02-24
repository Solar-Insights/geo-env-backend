import { describe, test, assert } from "vitest";
import { ServerFactory } from "../../src/serverFactory";

import airRouter from "../../src/routes/air";

const server = ServerFactory.create().withDefaultValues().build();

describe("", async () => {
    test("When true, then returns true", () => {
        assert.isTrue(true);
    });
});
