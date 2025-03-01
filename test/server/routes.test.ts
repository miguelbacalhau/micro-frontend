import { IncomingMessage, ServerResponse } from "node:http";

import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { getRequestBody } from "../../src/server/parseBody.js";
import {
  notFoundRoute,
  registerRoute,
  rootRoute,
} from "../../src/server/routes.js";
import { MicroFrontend } from "../../src/shared/micro-frontend.js";

vi.mock("../../src/server/parseBody.js");

describe("routes", () => {
  let req: Partial<IncomingMessage>;
  let res: Partial<ServerResponse>;
  let frontends: Record<string, MicroFrontend>;

  beforeEach(() => {
    req = {
      method: "GET",
      url: "/",
    };
    res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };
    frontends = {};
  });

  describe("registerRoute", () => {
    it("should register a service on POST /register/:serviceName", async () => {
      req.method = "POST";
      req.url = "/register/testService";
      (getRequestBody as Mock).mockResolvedValue({
        name: "main",
        assets: { js: "main.js", css: "styles.css" },
      });

      const result = await registerRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(true);
      expect(frontends["testService:main"]).toEqual({
        name: "main",
        assets: { js: "main.js", css: "styles.css" },
      });
      expect(res.writeHead).toHaveBeenCalledWith(200, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalledWith("Ok");
    });

    it("should return 400 on invalid service definition", async () => {
      req.method = "POST";
      req.url = "/register/testService";
      (getRequestBody as Mock).mockRejectedValue(new Error("Invalid"));

      const result = await registerRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(true);
      expect(res.writeHead).toHaveBeenCalledWith(400, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalledWith("Invalid micro-frontend definition");
    });

    it("should return false for non-matching routes", async () => {
      req.method = "GET";
      req.url = "/register/testService";

      const result = await registerRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(false);
    });
  });

  describe("rootRoute", () => {
    it("should return services on GET /", async () => {
      req.method = "GET";
      req.url = "/";

      const result = await rootRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(true);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(frontends));
    });

    it("should return false for non-root routes", async () => {
      req.method = "GET";
      req.url = "/not-root";

      const result = await rootRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(false);
    });
  });

  describe("notFoundRoute", () => {
    it("should return 404 for not found routes", async () => {
      const result = await notFoundRoute({
        req: req as IncomingMessage,
        res: res as ServerResponse,
        frontends,
      });

      expect(result).toBe(true);
      expect(res.writeHead).toHaveBeenCalledWith(404, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalledWith("Not found");
    });
  });
});
