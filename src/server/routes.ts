import { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";

import {
  getMicroFrontendName,
  MicroFrontend,
} from "../shared/micro-frontend.js";
import { getRequestBody } from "./parseBody.js";
import { validateRegister } from "./validation.js";

export type RouteParams = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  frontends: Record<string, MicroFrontend>;
};

export type Route = (params: RouteParams) => Promise<boolean>;

export async function registerRoute({
  req,
  res,
  frontends,
}: RouteParams): Promise<boolean> {
  const parsedUrl = url.parse(req.url ?? "", true);
  const { pathname } = parsedUrl;

  const registerMatch = pathname?.match(/^\/register\/([^/]+)$/);

  if (req.method === "POST" && registerMatch) {
    try {
      const parsedData = await getRequestBody(req);
      const validatedData = validateRegister(parsedData);

      const name = registerMatch[1];
      const microFrontendName = getMicroFrontendName(name, validatedData.name);

      frontends[microFrontendName] = validatedData;

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Ok");
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid micro-frontend definition");
    }

    return true;
  }

  return false;
}

export async function rootRoute({
  req,
  res,
  frontends,
}: RouteParams): Promise<boolean> {
  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify(frontends));

    return true;
  }

  return false;
}

export async function notFoundRoute({ res }: RouteParams): Promise<boolean> {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");

  return true;
}
