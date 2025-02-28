import net from "node:net";

export async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(0, () => {
      const addressInfo = server.address();

      if (addressInfo && typeof addressInfo === "object") {
        server.close(() => resolve((addressInfo as net.AddressInfo).port));
      } else {
        server.close(() => reject(new Error("Failed to get address info")));
      }
    });

    server.on("error", (err) => {
      server.close(() => reject(err));
    });
  });
}
