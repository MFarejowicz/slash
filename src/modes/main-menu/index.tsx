import { useCallback, useState } from "react";
import useSound from "use-sound";
import { FaChevronRight } from "react-icons/fa";
import { Mode, MODE_ORDER } from "../../App";
import menuMove from "../../assets/audio/menu-move.mp3";
import menuSelect from "../../assets/audio/menu-select.mp3";
import { useKeyPress } from "../../utils/useKeyPress";
import "./styles.css";

interface PublicProps {
  isTransition: boolean;
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const MainMenu = ({ setMode }: Props) => {
  const [modeIndex, setModeIndex] = useState(0);
  const [playMove] = useSound(menuMove);
  const [playSelect] = useSound(menuSelect);

  const onKeyDown = useCallback(
    (key: string) => {
      let newIndex = 0;
      switch (key) {
        case "arrowup":
          newIndex = (modeIndex + MODE_ORDER.length - 1) % MODE_ORDER.length;
          playMove();
          setModeIndex(newIndex);
          break;
        case "arrowdown":
          newIndex = (modeIndex + 1) % MODE_ORDER.length;
          playMove();
          setModeIndex(newIndex);
          break;
        case "enter":
          playSelect();
          setMode(MODE_ORDER[modeIndex]);
          break;
        default:
          break;
      }
    },
    [modeIndex, setMode, playMove, playSelect]
  );

  useKeyPress(onKeyDown);

  const renderModeOption = (index: number) => {
    return (
      <div className="MainMenu-option-container" key={`mode-option-${index}`}>
        {modeIndex === index && (
          <div className="MainMenu-option-selector">
            <FaChevronRight />
          </div>
        )}
        <div className="MainMenu-option" onClick={() => setMode(MODE_ORDER[index])}>
          {MODE_ORDER[index]}
        </div>
      </div>
    );
  };

  return (
    <div className="Mode-container">
      <div className="Mode-content">
        <h1 className="MainMenu-title">Way of the Slash!</h1>
        {MODE_ORDER.map((_el, index) => renderModeOption(index))}
        <div className="MainMenu-description">
          <p>Use the arrow keys to navigate</p>
          <p>Hit enter to choose</p>
          <p>Hit backspace to return</p>
        </div>
      </div>
    </div>
  );
};
