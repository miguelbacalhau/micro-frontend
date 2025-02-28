import { Entrypoints } from "./entrypoints.js";
import { PluginContext } from "./plugin-remote.js";

export function createDevManifest(input: Entrypoints, context: PluginContext) {
  return Object.entries(input).map(([name, file]) => {
    const normalizedPath = file.replace(/^(\.\/|\/)/, "");

    return {
      name,
      assets: { js: `${context.devServerUrl}/${normalizedPath}` },
    };
  });
}
