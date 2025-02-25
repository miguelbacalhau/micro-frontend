import { Plugin } from "vite";

import { configHook, Input } from "./config.js";
import { devTransforms } from "./devTransforms.js";

type Config = { input: Input; registerServerUrl: string };
export type PluginContext = { isDev: boolean; devServerUrl: string };

export function microFrontendRemote({ input }: Config): Plugin {
  const context = {
    devServerUrl: "",
    isDev: false,
  };

  return {
    name: "micro-frontend:remote",
    config: configHook(input),
    configureServer(server) {
      const host = server.config.server.host || "localhost";
      const port = server.config.server.port;

      context.devServerUrl = `${host}:${port}`;
      context.isDev = true;
    },
    transform: devTransforms(input, context),
  };
}
