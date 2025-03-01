import { describe, expect, it } from "vitest";

import { getAvailablePort } from "../../src/server/availablePort.js";

describe("getAvailablePort", () => {
  it("should return an available port", async () => {
    const port = await getAvailablePort();
    expect(port).to.be.a("number");
    expect(port).to.be.greaterThan(0);
  });

  it("should handle errors", async () => {
    try {
      await getAvailablePort();
    } catch (err) {
      expect(err).to.be.an("error");
    }
  });
});

