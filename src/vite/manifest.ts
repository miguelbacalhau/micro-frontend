import { REGISTER_SERVER_DEV_PORT } from "../shared/constants.js";
import { logInfo } from "../shared/logger.js";
import { Entrypoints } from "./entrypoints.js";
import { PluginContext } from "./plugin-remote.js";
import { fetchGet } from "./request.js";

export type Assets = { js: string; css?: string };
export type Manifest = { name: string; assets: Assets };

export function createDevManifest(
  input: Entrypoints,
  context: PluginContext,
): Manifest[] {
  return Object.entries(input).map(([name, file]) => {
    const normalizedPath = file.replace(/^(\.\/|\/)/, "");

    return {
      name,
      assets: { js: `http://${context.devServerUrl}/${normalizedPath}` },
    };
  });
}

export async function fetchManifest(registerServerUrl: string) {
  const manifest = {};

  try {
    const devManifest = await fetchGet<Record<string, Assets>>(
      `http:localhost:${REGISTER_SERVER_DEV_PORT}`,
    );

    Object.assign(manifest, devManifest);
  } catch {
    logInfo("vite:host", "no remote micro frontends found in dev mode");
  }

  try {
    const prodManifest =
      await fetchGet<Record<string, Assets>>(registerServerUrl);
    Object.assign(manifest, prodManifest);
  } catch {
    logInfo(
      "vite:host",
      `no remote micro frontends found at ${registerServerUrl}`,
    );
  }

  return manifest;
}
