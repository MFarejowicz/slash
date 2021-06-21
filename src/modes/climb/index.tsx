import { useCallback } from "react";
import useSound from "use-sound";
import { Mode } from "../../App";
import menuBack from "../../assets/menu-back.mp3";
import { useKeyPress } from "../../utils/useKeyPress";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Climb = ({ setMode }: Props) => {
  const [playBack] = useSound(menuBack);

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
        <p className="Mode-title">Climb</p>
      </div>
      <div className="Mode-content">test</div>
    </div>
  );
};
