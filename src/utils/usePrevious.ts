import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): ReturnType<typeof useRef<T>>["current"] {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
