import { MicroFrontend } from "../shared/micro-frontend.js";

export function validateRegister(data: unknown): MicroFrontend {
  const { name, assets } = data as MicroFrontend;

  if (assets) {
    const isNameValid = name && typeof name === "string";
    const isAssetsJsValid = assets.js && typeof assets.js === "string";
    const isAssetsCssValid =
      (assets.css && typeof assets.css === "string") ||
      assets.css === undefined;

    if (isNameValid && isAssetsJsValid && isAssetsCssValid) {
      return data as MicroFrontend;
    }
  }

  throw new Error("Invalid data");
}
