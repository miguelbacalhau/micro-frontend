import { Assets } from "./manifest.js";

export function injectImportMaps(manifest: Record<string, Assets>) {
  return async (html: string) => {
    const remoteMicroFes = Object.entries(manifest).reduce(
      (prev, [name, { js }]) => {
        return { ...prev, [name]: js };
      },
      {},
    );

    const importMaps = { imports: remoteMicroFes };

    return html.replace(
      "</head>",
      `<script type="importmap">${JSON.stringify(importMaps)}</script></head>`,
    );
  };
}
