import {
  getMicroFrontendName,
  NAME_SEPARATOR,
} from "../shared/micro-frontend.js";

export function remoteTransforms() {
  return (code: string) => {
    const importRegex = new RegExp(
      `import\\s+(\\{[^}]*\\}|[^}]+)\\s+from\\s+['"]([^'"]+)${NAME_SEPARATOR}([^'"]+)\\?micro-frontend['"];`,
      "g",
    );

    const transformedCode = code.replace(
      importRegex,
      (_match, imports, mod, entry) => {
        const microFrontendName = getMicroFrontendName(mod, entry);
        return `
import { createComponent } from "micro-frontend/react";
import ${mod} from "${microFrontendName}" ;

const ${imports} = createComponent(${mod});
`;
      },
    );

    return { code: transformedCode };
  };
}
