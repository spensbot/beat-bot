import { useEffect, useRef, useState } from 'react';

/** Calls the callback every animation frame during the component's lifecycle */
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [callback]);
}

/** Returns the value from getValue every animation frame
 * Triggers a re-render if getValue returns a new value */
export function useAnimatedValue<T>(getValue: () => T): T {
  const [value, setValue] = useState<T>(getValue())

  useAnimationFrame(_dt => {
    const newValue = getValue()
    if (newValue !== value) setValue(newValue)
  })

  return value
}