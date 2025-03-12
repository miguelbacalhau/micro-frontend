import http from "node:http";

import { logError, logMessage } from "../shared/logger.js";
import {
  getMicroFrontendName,
  MicroFrontend,
} from "../shared/micro-frontend.js";
import { getAvailablePort } from "./availablePort.js";
import { notFoundRoute, registerRoute, rootRoute, Route } from "./routes.js";

export type MicroFrontends = Record<string, MicroFrontend>;

export function createServer() {
  const routes: Route[] = [registerRoute, rootRoute, notFoundRoute];
  const frontends: MicroFrontends = {};

  const server = http.createServer(async (req, res) => {
    for (const route of routes) {
      const skipNext = await route({ req, res, frontends });

      if (skipNext) {
        break;
      }
    }
  });

  function shutdown() {
    logMessage("registry", "shutting down");

    server.close((err) => {
      if (err) {
        logError("registry", "error during shutdown:", err);
        process.exit(1);
      }

      logMessage("registry", "server closed");
      process.exit(0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  function register(name: string, frontend: MicroFrontend) {
    const microFrontendName = getMicroFrontendName(name, frontend.name);

    frontends[microFrontendName] = frontend;
  }

  async function listen(port?: number) {
    const nextPort = port || (await getAvailablePort());

    server.listen(nextPort, () => {
      logMessage("registry", `server running at http://localhost:${nextPort}`);
    });
  }

  return { listen, register, frontends };
}
