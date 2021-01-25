import { useEffect, useState } from "react";

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
  time?: number;
  onEnd?: (sequence: Sequence, attempt: Sequence) => void;
}

export interface Slash {
  phase: Phase;
  attempt: Sequence;
  sequence: Sequence;
  result: Result;
  start: () => void;
  add: (key: string) => void;
  reset: () => void;
}

export const useSlash = ({ sequence, time = 3000, onEnd }: Params): Slash => {
  const [phase, setPhase] = useState<Phase>(Phase.Ready);
  const [attempt, setAttempt] = useState<Sequence>([]);
  const [result, setResult] = useState<Result>(Result.NotFinished);

  const getAttempt = () => {
    return attempt.slice(0, sequence.length);
  };

  const start = () => {
    if (phase === Phase.Ready) {
      setPhase(Phase.Started);
      setTimeout(() => setPhase(Phase.Ended), time);
    }
  };

  const add = (key: string) => {
    if (phase !== Phase.Ended) {
      const updatedAttempt = attempt.concat(key.toLowerCase());
      setAttempt(updatedAttempt);
    }
  };

  const reset = () => {
    if (phase === Phase.Ended) {
      setPhase(Phase.Ready);
      setAttempt([]);
      setResult(Result.NotFinished);
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
          return;
        }

        if (actual !== expected) {
          setResult(Result.Wrong);
          return;
        }
      }

      setResult(Result.Success);
    }
  }, [phase, sequence, attempt, onEnd]);

  return { phase, attempt: getAttempt(), sequence, result, start, add, reset };
};
