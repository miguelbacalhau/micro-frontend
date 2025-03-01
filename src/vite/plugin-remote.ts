import { Plugin } from "vite";

import { createServer } from "../server/server.js";
import { REGISTER_SERVER_DEV_PORT } from "../shared/constants.js";
import { devTransforms } from "./dev-transforms.js";
import { addEntrypoints, Entrypoints } from "./entrypoints.js";
import { createDevManifest } from "./manifest.js";

type Config = { input: Entrypoints; registerServerUrl: string; name: string };
export type PluginContext = { isDev: boolean; devServerUrl: string };

export function microFrontendRemote({ name, input }: Config): Plugin {
  const context: PluginContext = {
    devServerUrl: "",
    isDev: false,
  };

  return {
    name: "micro-frontend:remote",
    config: addEntrypoints(input),
    configureServer(server) {
      const host = server.config.server.host || "localhost";
      const port = server.config.server.port;

      context.devServerUrl = `${host}:${port}`;
      context.isDev = true;

      const registerServer = createServer();
      const devManifest = createDevManifest(input, context);

      devManifest.forEach((frontend) => {
        registerServer.register(name, frontend);
      });

      registerServer.listen(REGISTER_SERVER_DEV_PORT);
    },
    transform: devTransforms(input, context),
    // generateBundle(_, bundle) {
    //   const manifest: Record<string, { file: string; imports: string[] }> = {};
    //   for (const [fileName, chunk] of Object.entries(bundle)) {
    //     if (chunk.type === "chunk" && chunk.isEntry) {
    //       console.log("test", chunk);
    //       manifest[fileName] = {
    //         file: chunk.fileName,
    //         imports: chunk.imports || [],
    //       };
    //     }
    //   }
    // },
  };
}
