import http from "node:http";

export function fetchGet<ResponseBody>(url: string): Promise<ResponseBody> {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const parsedData = JSON.parse(data);

          resolve(parsedData);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
