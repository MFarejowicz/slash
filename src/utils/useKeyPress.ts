import { useCallback } from "react";
import useEventListener from "@use-it/event-listener";

type KeyPressFunction = (key: string) => void;

export function useKeyPress(callback: KeyPressFunction) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!event.repeat) {
        callback(key);
      }
    },
    [callback]
  );

  useEventListener("keydown", onKeyDown);
}
