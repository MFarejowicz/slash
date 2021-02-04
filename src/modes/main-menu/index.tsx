import { Mode } from "../../App";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const MainMenu = (props: Props) => {
  return (
    <div className="Mode-container">
      <div className="Mode-content">
        <div className="MainMenu-title">Way of the Slash!</div>
        <div className="MainMenu-option" onClick={() => props.setMode(Mode.Practice)}>
          Practice
        </div>
        <div className="MainMenu-option" onClick={() => props.setMode(Mode.Climb)}>
          Climb
        </div>
      </div>
    </div>
  );
};
