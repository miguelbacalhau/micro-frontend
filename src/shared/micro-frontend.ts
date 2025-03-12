export type Assets = {
  js: string;
  css?: string;
};

export type MicroFrontend = {
  name: string;
  assets: Assets;
};

export const NAME_SEPARATOR = "#";

export function getMicroFrontendName(name: string, entry: string) {
  return `${name}${NAME_SEPARATOR}${entry}`;
}
