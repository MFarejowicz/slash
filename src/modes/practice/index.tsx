import { useCallback, useState } from "react";
import useSound from "use-sound";
import { Mode } from "../../App";
import menuBack from "../../assets/audio/menu-back.mp3";
import { Slash } from "../../components/slash";
import { generateSequence } from "../../utils/generateSequence";
import { useKeyPress } from "../../utils/useKeyPress";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Practice = ({ setMode }: Props) => {
  const [sequence, setSequence] = useState(generateSequence());
  const [maxTime] = useState(3000);
  const [playBack] = useSound(menuBack);

  const onAdvance = () => {
    const sequence = generateSequence();
    setSequence(sequence);
  };

  const onKeyDown = useCallback(
    (key: string) => {
      switch (key) {
        case "backspace":
          playBack();
          setMode(Mode.None);
          break;
        default:
          break;
      }
    },
    [playBack, setMode]
  );

  useKeyPress(onKeyDown);

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
