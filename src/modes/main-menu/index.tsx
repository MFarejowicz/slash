import { useCallback, useState } from "react";
import useEventListener from "@use-it/event-listener";
import { Mode, MODE_ORDER } from "../../App";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const MainMenu = ({ setMode }: Props) => {
  const [modeIndex, setModeIndex] = useState(0);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!event.repeat) {
        let newIndex = 0;
        switch (key) {
          case "arrowup":
            newIndex = (modeIndex - 1) % MODE_ORDER.length;
            break;
          case "arrowdown":
            newIndex = (modeIndex + 1) % MODE_ORDER.length;
            break;
          case "enter":
            setMode(MODE_ORDER[modeIndex]);
            break;
          default:
            break;
        }
        setModeIndex(newIndex);
      }
    },
    [modeIndex, setMode]
  );

  useEventListener("keydown", onKeyDown);

  const renderModeOption = (index: number) => {
    return (
      <div className="MainMenu-option-container" key={`mode-option-${index}`}>
        {modeIndex === index && <div>{">"}</div>}
        <div className="MainMenu-option" onClick={() => setMode(MODE_ORDER[index])}>
          {MODE_ORDER[index]}
        </div>
      </div>
    );
  };

  return (
    <div className="Mode-container">
      <div className="Mode-content">
        <div className="MainMenu-title">Way of the Slash!</div>
        {MODE_ORDER.map((_el, index) => renderModeOption(index))}
      </div>
    </div>
  );
};
