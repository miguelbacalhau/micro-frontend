import { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";

import { getRequestBody } from "./parseBody.js";

export type RouteParams = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  services: Record<string, unknown>;
};

export type Route = (params: RouteParams) => Promise<boolean>;

export async function registerRoute({
  req,
  res,
  services,
}: RouteParams): Promise<boolean> {
  const parsedUrl = url.parse(req.url ?? "", true);
  const { pathname } = parsedUrl;

  const registerMatch = pathname?.match(/^\/register\/([^/]+)$/);

  if (req.method === "POST" && registerMatch) {
    try {
      const parsedData = await getRequestBody(req);
      const serviceName = registerMatch[1];

      services[serviceName] = parsedData;

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid service definition");
    }

    return true;
  }

  return false;
}

export async function rootRoute({
  req,
  res,
  services,
}: RouteParams): Promise<boolean> {
  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify(services));

    return true;
  }

  return false;
}

export async function notFoundRoute({ res }: RouteParams): Promise<boolean> {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");

  return true;
}
