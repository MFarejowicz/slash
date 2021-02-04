import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mode } from "../../App";
import { Slash } from "../../components/slash";
import { generateSequence } from "../../generateSequence";
import "./styles.css";

interface PublicProps {
  setMode: (mode: Mode) => void;
}

type Props = PublicProps;

export const Practice = (props: Props) => {
  const [sequence, setSequence] = useState(generateSequence());
  const [time, setTime] = useState(3000);

  const onAdvance = () => {
    const sequence = generateSequence();
    setSequence(sequence);
  };

  return (
    <div className="Mode-container">
      <div className="Mode-header">
        <FontAwesomeIcon
          icon={["fas", "arrow-left"]}
          className="Back"
          size="4x"
          onClick={() => props.setMode(Mode.None)}
        />
        <p className="Mode-title">Practice</p>
      </div>
      <div className="Mode-content">
        <Slash sequence={sequence} time={time} onAdvance={onAdvance} />
      </div>
    </div>
  );
};
