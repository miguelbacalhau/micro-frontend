import http from "node:http";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createServer } from "../../src/server/server.js";

vi.mock("node:http", () => {
  const listen = vi.fn();
  const close = vi.fn();

  const createServer = vi.fn(() => {
    return { listen, close };
  });

  return { default: { createServer }, listen, close };
});

vi.mock("../../src/shared/logger.js", () => ({
  logError: vi.fn(),
  logMessage: vi.fn(),
}));

vi.mock("../../src/server/availablePort.js", () => ({
  getAvailablePort: vi.fn().mockResolvedValue(3000),
}));

describe("createServer", () => {
  let server: ReturnType<typeof createServer>;
  let mockServerInstance: ReturnType<typeof http.createServer>;

  beforeEach(() => {
    server = createServer();
    mockServerInstance = http.createServer();
  });

  it("should create a server instance", () => {
    expect(http.createServer).toHaveBeenCalled();
  });

  it("should register a service", () => {
    const frontend = { name: "main", assets: { js: "index.js" } };

    server.register("testService", frontend);

    expect(server.frontends).toMatchObject({ "testService:main": frontend });
  });

  it("should listen on a specified port", async () => {
    const port = 4000;
    await server.listen(port);
    expect(mockServerInstance.listen).toHaveBeenCalledWith(
      port,
      expect.any(Function),
    );
  });

  it("should listen on an available port if no port is specified", async () => {
    await server.listen();
    expect(mockServerInstance.listen).toHaveBeenCalledWith(
      3000,
      expect.any(Function),
    );
  });
});
