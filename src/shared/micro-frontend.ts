export type Assets = {
  js: string;
  css?: string;
};

export type MicroFrontend = {
  name: string;
  assets: Assets;
};
