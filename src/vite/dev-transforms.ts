import path from "node:path";

import { Entrypoints } from "./entrypoints.js";
import { PluginContext } from "./plugin-remote.js";

export function devTransforms(input: Entrypoints, context: PluginContext) {
  return (code: string, id: string) => {
    const inputFiles = Object.values(input);
    const absPathFiles = inputFiles.map((file) => path.resolve(file));

    if (context.isDev && absPathFiles.includes(id)) {
      const importRegex =
        /import\s+(\{[^}]*\}|[^}]+)\s+from\s+['"]([^'"]+)['"];/g;

      const transformedCode = code.replace(
        importRegex,
        (_match, imports, module) => {
          return `const ${imports} = await import('${module}');`;
        },
      );

      const hmrCode = `
const RefreshRuntime=  await import('http://${context.devServerUrl}/@react-refresh')
RefreshRuntime.default.injectIntoGlobalHook(window);

window.$RefreshReg$ = () => {};  // Register the React components
window.$RefreshSig$ = () => (type) => type; // Register the signature for Fast Refresh

window.__vite_plugin_react_preamble_installed__ = true;

${transformedCode}
  `;

      return { code: hmrCode };
    }
  };
}
