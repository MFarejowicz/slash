import { useCallback } from "react";
import useSound from "use-sound";
import { Mode } from "../../App";
import menuBack from "../../assets/audio/menu-back.mp3";
import { Slash } from "../../components/slash";
import { Result, useSlash } from "../../contexts/slash-context";
import { useKeyPress } from "../../utils/useKeyPress";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Practice = ({ setMode }: Props) => {
  const slash = useSlash();
  const [playBack] = useSound(menuBack);

  const onKeyDown = useCallback(
    (key: string) => {
      switch (key) {
        case "backspace":
          slash.reset();
          playBack();
          setMode(Mode.None);
          break;
        case " ":
          slash.reset();
          break;
        case "enter":
          if (slash.result === Result.Success) {
            slash.setMaxTime(slash.maxTime - 100);
            slash.renew();
          }
          break;
        default:
          break;
      }
    },
    [playBack, setMode, slash]
  );

  useKeyPress(onKeyDown);

  return (
    <div className="Mode-container">
      <div className="Mode-header">
        <p className="Mode-title">Practice</p>
      </div>
      <div className="Mode-content">
        <Slash />
      </div>
    </div>
  );
};
