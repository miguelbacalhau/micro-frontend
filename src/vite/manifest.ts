import { Entrypoints } from "./entrypoints.js";
import { PluginContext } from "./plugin-remote.js";

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
