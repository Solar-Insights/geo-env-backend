import { describe, test, assert } from "vitest";
import { RoutesFixture } from "./routesFixture";

const routeFixture = RoutesFixture.create().withDefaultValues().build();

describe("", () => {
    test("When true, then returns true", () => {
        assert.isTrue(true);
    });
});
