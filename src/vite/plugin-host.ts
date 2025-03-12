import { Plugin } from "vite";

import {
  externalConfigResolved,
  externalLoadHook,
  externalResolveIdHook,
} from "./externals.js";
import { injectImportMaps } from "./inject-importmaps.js";
import { fetchManifest } from "./manifest.js";
import { remoteTransforms } from "./remote-transform.js";

type Config = { registerServerUrl: string };

export async function microFrontendHost({
  registerServerUrl,
}: Config): Promise<Plugin> {
  const manifest = await fetchManifest(registerServerUrl);
  const frontends = Object.keys(manifest);

  return {
    name: "micro-frontend:host",
    resolveId: externalResolveIdHook(frontends),
    load: externalLoadHook(frontends),
    configResolved: externalConfigResolved(frontends),
    transform: remoteTransforms(),
    transformIndexHtml: injectImportMaps(manifest),
  };
}
