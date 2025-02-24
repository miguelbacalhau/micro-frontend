import { ResolvedConfig } from "vite";

/**
 * The esolve id hook guarantees that vite knows how to
 * resolve the imports of the external micro frontends
 */
export function externalResolveIdHook(frontends: string[]) {
  return (id: string) => {
    if (frontends.includes(id)) {
      return { id, external: true };
    }

    return null;
  };
}

/**
 * The load hook guarantees that vite loads an empty module
 * when trying to load the external micro frontend
 */
export function externalLoadHook(frontends: string[]) {
  return (id: string) => {
    if (frontends.includes(id)) {
      return "";
    }

    return null;
  };
}

/**
 * The config resolved hook guarantees that the micro frontend
 * imports are not overriden by vite
 */
export function externalConfigResolved(frontends: string[]) {
  return (resolvedConfig: ResolvedConfig) => {
    // @ts-expect-error resolvedConfig is read-only but we must
    // push the import resolver plugin after vite:import-analysis
    // so we can keep the import without vite altering it
    resolvedConfig.plugins.push({
      name: "micro-fronted:host:import-resolver",
      enforce: "post",
      transform(code: string) {
        const regex = new RegExp(`/@id/(${frontends.join("|")})`);

        code = code.replace(regex, "$1");

        return { code };
      },
    });
  };
}
