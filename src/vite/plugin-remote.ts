import { configHook, Input } from "./config.js";

type Config = { input: Input; registerServerUrl: string };

export function microFrontendRemote({ input }: Config) {
  return {
    name: "micro-frontend:remote",
    config: configHook(input),
  };
}
