import { IncomingMessage } from "node:http";

export function getRequestBody(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);

        resolve(parsedBody);
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}
