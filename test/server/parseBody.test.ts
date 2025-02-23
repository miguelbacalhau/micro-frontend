import { IncomingMessage } from "node:http";

import { describe, expect, it } from "vitest";

import { getRequestBody } from "../../src/server/parseBody.js";

describe("getRequestBody", () => {
  it("should parse JSON body correctly", async () => {
    // @ts-expect-error we are using the Incoming message with mocked methods
    const req = new IncomingMessage(null);
    const body = JSON.stringify({ key: "value" });

    req.on = (event, callback) => {
      if (event === "data") {
        // @ts-expect-error callback is mocked
        callback(Buffer.from(body));
      } else if (event === "end") {
        // @ts-expect-error callback is mocked
        callback();
      }
      return req;
    };

    const result = await getRequestBody(req);
    expect(result).toEqual({ key: "value" });
  });

  it("should reject on invalid JSON", async () => {
    // @ts-expect-error we are using the Incoming message with mocked methods
    const req = new IncomingMessage(null);
    const body = "invalid JSON";

    req.on = (event, callback) => {
      if (event === "data") {
        // @ts-expect-error callback is mocked
        callback(Buffer.from(body));
      } else if (event === "end") {
        // @ts-expect-error callback is mocked
        callback();
      }

      return req;
    };

    await expect(getRequestBody(req)).rejects.toThrow();
  });

  it("should reject on request error", async () => {
    // @ts-expect-error we are using the Incoming message with mocked methods
    const req = new IncomingMessage(null);

    req.on = (event, callback) => {
      if (event === "error") {
        callback(new Error("Request error"));
      }
      return req;
    };

    await expect(getRequestBody(req)).rejects.toThrow("Request error");
  });
});
