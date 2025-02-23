import http from "node:http";

import { notFoundRoute, registerRoute, rootRoute, Route } from "./routes.js";

export function createServer() {
  const routes: Route[] = [];
  const services: Record<string, unknown> = {};

  const server = http.createServer(async (req, res) => {
    for (const route of routes) {
      const skipNext = await route({ req, res, services });

      if (skipNext) {
        break;
      }
    }
  });

  function addRoute(route: Route) {
    routes.push(route);
  }

  return { listen: server.listen.bind(server), addRoute };
}

// Start the server
const server = createServer();

server.addRoute(registerRoute);
server.addRoute(rootRoute);
server.addRoute(notFoundRoute);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
