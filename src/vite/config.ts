import { UserConfig } from "vite";

export type Input = Record<string, string>;

export function configHook(input: Input) {
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
