import http from "node:http";

import { getAvailablePort } from "./availablePort.js";
import { notFoundRoute, registerRoute, rootRoute, Route } from "./routes.js";

export type Services = Record<string, unknown>;

export function createServer() {
  const routes: Route[] = [registerRoute, rootRoute, notFoundRoute];
  const services: Services = {};

  const server = http.createServer(async (req, res) => {
    for (const route of routes) {
      const skipNext = await route({ req, res, services });

      if (skipNext) {
        break;
      }
    }
  });

  function register(name: string, service: unknown) {
    services[name] = service;
  }

  async function listen(port?: number) {
    const nextPort = port || (await getAvailablePort());

    server.listen(nextPort, () => {
      console.log(`Server running at http://localhost:${nextPort}/`);
    });
  }

  return { listen, register };
}
