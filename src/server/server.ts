import http from "node:http";
import url from "node:url";

export function createServer() {
  const services: Record<string, unknown> = {};

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url ?? "", true);
    const { pathname } = parsedUrl;

    const registerMatch = pathname?.match(/^\/register\/([^/]+)$/);

    console.log(req.method, req.url, registerMatch);
    if (req.method === "POST" && registerMatch) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const parsedData = JSON.parse(body);
          const serviceName = registerMatch[1];

          services[serviceName] = parsedData;
          // Send a JSON response back
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Data received", data: parsedData }),
          );
        } catch (err) {
          console.log(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
    } else if (req.method === "GET" && req.url === "/") {
      res.end(JSON.stringify(services));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  });

  return server;
}

// Define the port to listen on
const PORT = 3000;

// Start the server
createServer().listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
