import { Plugin } from "vite";

import { Input } from "./config.js";
import {
  externalConfigResolved,
  externalLoadHook,
  externalResolveIdHook,
} from "./externals.js";

type Config = { input: Input; registerServerUrl: string };

export function microFrontendHost({ input }: Config): Plugin {
  const frontends = Object.keys(input);

  return {
    name: "micro-frontend:host",
    resolveId: externalResolveIdHook(frontends),
    load: externalLoadHook(frontends),
    configResolved: externalConfigResolved(frontends),
  };
}
