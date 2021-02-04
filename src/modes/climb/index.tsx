import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mode } from "../../App";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Climb = (props: Props) => {
  return (
    <div className="Mode-container">
      <div className="Mode-header">
        <FontAwesomeIcon
          icon={["fas", "arrow-left"]}
          className="Back"
          size="4x"
          onClick={() => props.setMode(Mode.None)}
        />
        <p className="Mode-title">Climb</p>
      </div>
      <div className="Mode-content">test</div>
    </div>
  );
};
