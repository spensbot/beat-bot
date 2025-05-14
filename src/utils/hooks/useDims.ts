import { useEffect, useRef, useState } from "react";

interface ElementDims {
  width: number
  height: number
  widthDevice: number
  heightDevice: number
}

/** Returns the updated dimentions of the element attached to the returned ref  */
export function useDims<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  return [useDimsForRef(ref), ref]
}

/** Returns the updated dimentions of the element attached to the ref */
export function useDimsForRef<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [dims, setDims] = useState<ElementDims | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const deviceRatio = window.devicePixelRatio

      if (entry.contentRect) {
        setDims({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          widthDevice: entry.contentRect.width * deviceRatio,
          heightDevice: entry.contentRect.height * deviceRatio
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return dims;
}