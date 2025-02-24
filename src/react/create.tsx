import { ComponentType } from "react";
import { createRoot } from "react-dom/client";

export type MicroFrontend<Props> = {
  mount(options: { props: Props; el: HTMLElement }): void;
  update(options: { props: Props; el: HTMLElement }): void;
  unmount(options: { el: HTMLElement }): void;
};

/**
 * Create a framework agnostic micro-frontend
 */
export function createMicroFrontend<Props extends object>(
  Component: ComponentType<Props>,
): MicroFrontend<Props> {
  // keep track of root between mount/unmount cycles
  const rootMap = new WeakMap();

  return {
    mount({ props, el }: { props: Props; el: HTMLElement }) {
      const root = createRoot(el);

      rootMap.set(el, root);

      root.render(<Component {...props} />);
    },
    update({ el, props }: { el: HTMLElement; props: Props }) {
      const root = rootMap.get(el);

      if (root) {
        root.render(<Component {...props} />);
      }
    },
    unmount({ el }: { el: HTMLElement }) {
      const root = rootMap.get(el);

      if (root) {
        root.unmount();
        rootMap.delete(el);
      }
    },
  };
}
