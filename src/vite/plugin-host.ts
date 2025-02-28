import { Plugin } from "vite";

import {
  externalConfigResolved,
  externalLoadHook,
  externalResolveIdHook,
} from "./externals.js";
import { injectImportMaps } from "./inject-importmaps.js";
import { Assets } from "./manifest.js";
import { fetchGet } from "./request.js";

type Config = { registerServerUrl: string };

export async function microFrontendHost({
  registerServerUrl,
}: Config): Promise<Plugin> {
  const manifest = await fetchGet<Record<string, Assets>>(registerServerUrl);
  const frontends = Object.keys(manifest);

  return {
    name: "micro-frontend:host",
    resolveId: externalResolveIdHook(frontends),
    load: externalLoadHook(frontends),
    configResolved: externalConfigResolved(frontends),
    transformIndexHtml: injectImportMaps(manifest),
  };
}
