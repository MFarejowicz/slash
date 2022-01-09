import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import bamboo from "../assets/audio/bamboo.mp3";
import slashFail from "../assets/audio/slash-fail.mp3";
import slashSuccess from "../assets/audio/slash-fin.mp3";
import { useTimer } from "./useTimer";

const START_RATE = 0.95;
const RATE_INCREASE = 0.05;

export enum Phase {
  Ready = "ready",
  Started = "started",
  Ended = "ended",
}

export enum Result {
  Success = "success",
  TooSlow = "too-slow",
  Wrong = "wrong",
  NotFinished = "not-finished",
}

export type Sequence = string[];

export interface Params {
  sequence: Sequence;
  maxTime?: number;
  onStart?: (sequence: Sequence) => void;
  onEnd?: (sequence: Sequence, attempt: Sequence) => void;
}

export interface Slash {
  phase: Phase;
  attempt: Sequence;
  sequence: Sequence;
  result: Result;
  time: number;
  start: () => void;
  add: (key: string) => void;
  reset: () => void;
}

export const useSlash = ({ sequence, maxTime = 3000, onStart, onEnd }: Params): Slash => {
  const [phase, setPhase] = useState<Phase>(Phase.Ready);
  const [attempt, setAttempt] = useState<Sequence>([]);
  const [result, setResult] = useState<Result>(Result.NotFinished);
  const timer = useTimer();
  let timeout = useRef<ReturnType<typeof setInterval>>();

  const [bambooRate, setBambooRate] = useState(START_RATE);
  const [playBamboo] = useSound(bamboo, { playbackRate: bambooRate, volume: 0.9 });
  const [playSuccess] = useSound(slashSuccess, { volume: 0.8 });
  const [playFail] = useSound(slashFail, { volume: 1 });

  const start = () => {
    if (phase === Phase.Ready) {
      onStart?.(sequence);

      setPhase(Phase.Started);
      timeout.current = setTimeout(() => setPhase(Phase.Ended), maxTime);
    }
  };

  /** clean up timeout if active when unmounting */
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const add = (key: string) => {
    if (phase !== Phase.Ended && attempt.length < sequence.length) {
      const updatedAttempt = attempt.concat(key.toLowerCase());
      setAttempt(updatedAttempt);

      setBambooRate(bambooRate + RATE_INCREASE);
      playBamboo();

      if (attempt.length === 0) {
        timer.start();
      }

      if (attempt.length === sequence.length - 1) {
        timer.stop();
      }
    }
  };

  const reset = () => {
    if (phase === Phase.Ended) {
      setPhase(Phase.Ready);
      setAttempt([]);
      setResult(Result.NotFinished);
      setBambooRate(START_RATE);
      timer.reset();
    }
  };

  useEffect(() => {
    if (phase === Phase.Ended) {
      onEnd?.(sequence, attempt);

      for (let i = 0; i < sequence.length; i++) {
        const expected = sequence[i];
        const actual = attempt[i];

        if (!actual) {
          setResult(Result.TooSlow);
          playFail();
          return;
        }

        if (actual !== expected) {
          setResult(Result.Wrong);
          playFail();
          return;
        }
      }

      setResult(Result.Success);
      playSuccess();
    }
  }, [phase, sequence, attempt, onEnd, playFail, playSuccess]);

  return { phase, attempt, sequence, result, time: timer.time, start, add, reset };
};
