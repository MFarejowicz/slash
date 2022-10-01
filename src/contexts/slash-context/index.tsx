import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSound from "use-sound";
import bamboo from "../../assets/audio/bamboo.mp3";
import slashFail from "../../assets/audio/slash-fail.mp3";
import slashSuccess from "../../assets/audio/slash-fin.mp3";
import { generateSequence } from "../../utils/generateSequence";
import { usePrevious } from "../../utils/usePrevious";
import { useTimer } from "../../utils/useTimer";

const DEFAULT_SLASH_MAX_TIME = 3000;
const BAMBOO_START_RATE = 0.95;
const BAMBOO_RATE_INCREASE = 0.05;

export enum Phase {
  Ready = "ready",
  Started = "started",
  Ended = "ended",
}

export type Sequence = string[];

export enum Result {
  Success = "success",
  TooSlow = "too-slow",
  Wrong = "wrong",
  NotFinished = "not-finished",
}

interface SlashContextValue {
  phase: Phase;
  attempt: Sequence;
  sequence: Sequence;
  result: Result;
  time: number;
  maxTime: number;
  start: () => void;
  add: (key: string) => void;
  reset: () => void;
  renew: () => void;
  setMaxTime: (time: number) => void;
}

const defaultSlashContextValue: SlashContextValue = {
  phase: Phase.Ready,
  attempt: [],
  sequence: [],
  result: Result.NotFinished,
  time: DEFAULT_SLASH_MAX_TIME,
  maxTime: DEFAULT_SLASH_MAX_TIME,
  start: () => null,
  add: () => null,
  reset: () => null,
  renew: () => null,
  setMaxTime: () => null,
};

const SlashContext = createContext<SlashContextValue>(defaultSlashContextValue);
export const useSlash = () => useContext(SlashContext);

const useSlashContextValue = () => {
  const [sequence, setSequence] = useState<Sequence>(generateSequence());
  const [attempt, setAttempt] = useState<Sequence>([]);
  const [maxTime, setMaxTime] = useState<number>(DEFAULT_SLASH_MAX_TIME);
  const [phase, setPhase] = useState<Phase>(Phase.Ready);
  const prevPhase = usePrevious(phase);
  const [result, setResult] = useState<Result>(Result.NotFinished);

  const timer = useTimer();
  let timeout = useRef<ReturnType<typeof setInterval>>();

  const [bambooRate, setBambooRate] = useState(BAMBOO_START_RATE);
  const [playBamboo] = useSound(bamboo, { playbackRate: bambooRate, volume: 0.9 });
  const [playSuccess] = useSound(slashSuccess, { volume: 0.8 });
  const [playFail] = useSound(slashFail, { volume: 1 });

  const start = useCallback(() => {
    if (phase === Phase.Ready) {
      setPhase(Phase.Started);
      timer.start();
      timeout.current = setTimeout(() => setPhase(Phase.Ended), maxTime);
    }
  }, [maxTime, phase, timer]);

  /** Adds a character to the attempt */
  const add = useCallback(
    (key: string) => {
      if (phase !== Phase.Ended && attempt.length < sequence.length) {
        if (attempt.length === 0) {
          start();
        }

        setAttempt((oldAttempt) => [...oldAttempt, key.toLowerCase()]);

        setBambooRate((oldRate) => oldRate + BAMBOO_RATE_INCREASE);
        playBamboo();

        if (attempt.length === sequence.length - 1) {
          timer.stop();
        }
      }
    },
    [attempt.length, phase, playBamboo, sequence.length, start, timer]
  );

  /** Cleans everything up WITHOUT creating a new sequence */
  const reset = useCallback(() => {
    setPhase(Phase.Ready);
    setAttempt([]);
    setResult(Result.NotFinished);
    setBambooRate(BAMBOO_START_RATE);
    timer.reset();
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [timer]);

  /** Cleans everything up AND creates a new sequence */
  const renew = useCallback(() => {
    reset();
    setSequence(generateSequence());
  }, [reset]);

  /** Check for result when moving from Started to Ended */
  useEffect(() => {
    if (prevPhase === Phase.Started && phase === Phase.Ended) {
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
  }, [phase, sequence, attempt, prevPhase, playSuccess, playFail]);

  /** Clean up timeout if active when unmounting */
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const value: SlashContextValue = useMemo(
    () => ({
      phase,
      attempt,
      sequence,
      result,
      time: timer.time,
      maxTime,
      start,
      add,
      reset,
      renew,
      setMaxTime,
    }),
    [add, attempt, maxTime, phase, renew, reset, result, sequence, start, timer.time]
  );

  return value;
};

interface SlashContextManagerProps {
  children: React.ReactNode;
}

export const SlashContextManager = ({ children }: SlashContextManagerProps) => {
  const value = useSlashContextValue();

  return <SlashContext.Provider value={value}>{children}</SlashContext.Provider>;
};
