import { useCallback, useState } from "react";

export interface TimerParams {
  max?: number;
}

export interface Timer {
  time: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useTimer = ({ max = 3000 }: TimerParams = {}) => {
  const [startTime, setStartTime] = useState<Date>();
  const [stopTime, setStopTime] = useState<Date>();

  const start = useCallback(() => {
    setStartTime(new Date());
  }, []);

  const stop = useCallback(() => {
    setStopTime(new Date());
  }, []);

  const reset = useCallback(() => {
    setStartTime(undefined);
    setStopTime(undefined);
  }, []);

  const getTime = useCallback(() => {
    if (startTime && stopTime) {
      return stopTime.getTime() - startTime.getTime();
    }

    return max;
  }, [startTime, stopTime, max]);

  return { start, stop, reset, time: getTime() };
};
