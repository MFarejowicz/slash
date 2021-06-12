import { useCallback, useState } from "react";
import useEventListener from "@use-it/event-listener";
import { Mode } from "../../App";
import { Slash } from "../../components/slash";
import { generateSequence } from "../../generateSequence";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Practice = ({ setMode }: Props) => {
  const [sequence, setSequence] = useState(generateSequence());
  const [maxTime] = useState(3000);

  const onAdvance = () => {
    const sequence = generateSequence();
    setSequence(sequence);
  };

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!event.repeat) {
        switch (key) {
          case "backspace":
            setMode(Mode.None);
            break;
          default:
            break;
        }
      }
    },
    [setMode]
  );

  useEventListener("keydown", onKeyDown);

  return (
    <div className="Mode-container">
      <div className="Mode-header">
        <p className="Mode-title">Practice</p>
      </div>
      <div className="Mode-content">
        <Slash sequence={sequence} maxTime={maxTime} onAdvance={onAdvance} />
      </div>
    </div>
  );
};
