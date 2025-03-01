import { MicroFrontend } from "../shared/micro-frontend.js";

export function injectImportMaps(manifest: Record<string, MicroFrontend>) {
  return async (html: string) => {
    const remoteMicroFes = Object.entries(manifest).reduce(
      (prev, [name, { assets }]) => {
        return { ...prev, [name]: assets.js };
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
