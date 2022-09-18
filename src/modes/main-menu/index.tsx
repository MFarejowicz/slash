import { useCallback, useState } from "react";
import useSound from "use-sound";
import { FaChevronRight } from "react-icons/fa";
import { Mode, MODE_ORDER } from "../../App";
import menuMove from "../../assets/audio/menu-move.mp3";
import menuSelect from "../../assets/audio/menu-select.mp3";
import { useKeyPress } from "../../utils/useKeyPress";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const MainMenu = ({ setMode }: Props) => {
  const [modeIndex, setModeIndex] = useState(0);
  const [playMove] = useSound(menuMove);
  const [playSelect] = useSound(menuSelect);

  const selectMode = useCallback(
    (index) => {
      playMove();
      setModeIndex(index);
    },
    [playMove]
  );

  const toMode = useCallback(
    (index) => {
      playSelect();
      setMode(MODE_ORDER[index]);
    },
    [playSelect, setMode]
  );

  const onKeyDown = useCallback(
    (key: string) => {
      let newIndex = 0;
      switch (key) {
        case "arrowup":
          newIndex = (modeIndex + MODE_ORDER.length - 1) % MODE_ORDER.length;
          selectMode(newIndex);
          break;
        case "arrowdown":
          newIndex = (modeIndex + 1) % MODE_ORDER.length;
          selectMode(newIndex);
          break;
        case "enter":
          toMode(modeIndex);
          break;
        default:
          break;
      }
    },
    [modeIndex, selectMode, toMode]
  );

  useKeyPress(onKeyDown);

  const renderModeOption = useCallback(
    (index: number) => {
      return (
        <div
          className="MainMenu-option-container"
          key={`mode-option-${index}`}
          onMouseEnter={() => selectMode(index)}
        >
          {modeIndex === index && (
            <div className="MainMenu-option-selector">
              <FaChevronRight />
            </div>
          )}
          <div className="MainMenu-option" onClick={() => toMode(index)}>
            {MODE_ORDER[index]}
          </div>
        </div>
      );
    },
    [modeIndex, selectMode, toMode]
  );

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
