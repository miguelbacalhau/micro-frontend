import {
  ComponentType,
  FunctionComponent,
  useLayoutEffect,
  useRef,
} from "react";

import { MicroFrontend } from "./create.js";

/**
 * Turn a micro-frontend into a react component
 */
export function createComponent<Props>(
  microFrontend: MicroFrontend<Props>,
  name: string,
): ComponentType<Props> {
  const MicroFrontendComponent: FunctionComponent<Props> = (props: Props) => {
    const rootElRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef<boolean>(false);

    useLayoutEffect(() => {
      if (!isMountedRef.current) {
        return;
      }

      microFrontend.update({ props, el: rootElRef.current! });
    }, [props]);

    useLayoutEffect(() => {
      const renderTimeout = setTimeout(() => {
        const el = rootElRef.current!;

        microFrontend.mount({ props, el });

        isMountedRef.current = true;
      });

      return () => {
        clearTimeout(renderTimeout);
        const el = rootElRef.current;
        setTimeout(() => {
          if (el) {
            microFrontend.unmount({ el });
          }
        });
      };
    }, []);

    return <div ref={rootElRef} />;
  };

  MicroFrontendComponent.displayName = `MicroFrontend(${name})`;

  return MicroFrontendComponent;
}
