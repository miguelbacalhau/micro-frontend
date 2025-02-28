import { UserConfig } from "vite";

export type Entrypoints = Record<string, string>;

export function addEntrypoints(input: Entrypoints) {
  return (config: UserConfig) => {
    if (!config.build) {
      config.build = {};
    }

    if (!config.build.rollupOptions) {
      config.build.rollupOptions = {};
    }

    config.build.rollupOptions.input = input;

    return config;
  };
}
