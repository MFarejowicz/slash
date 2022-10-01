import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import forest from "./assets/audio/forest.mp3";
import { Leaf, LEAF_QUANTITY } from "./components/leaf";
import { SlashContextManager } from "./contexts/slash-context";
import { wavingGrass } from "./grass";
import { Climb } from "./modes/climb";
import { MainMenu } from "./modes/main-menu";
import { Practice } from "./modes/practice";
import "./App.css";

export enum Mode {
  None = "none",
  Practice = "practice",
  Climb = "climb",
}

enum LeafPosition {
  Down = "down",
  Up = "up",
}

export const MODE_ORDER = [Mode.Practice, Mode.Climb];

library.add(fas, far);

function App() {
  const [mode, setMode] = useState(Mode.None);
  const [leafPosition, setLeafPosition] = useState(LeafPosition.Down);

  const isPlayingAmbience = useRef(false);
  const [playAmbience] = useSound(forest, { loop: true });

  // start the grass waving animation once
  useEffect(() => {
    wavingGrass();
  }, []);

  const delayedSetMode = useCallback(
    (mode: Mode) => {
      setLeafPosition(mode === Mode.None ? LeafPosition.Down : LeafPosition.Up);
      if (!isPlayingAmbience.current) {
        playAmbience();
        isPlayingAmbience.current = true;
      }
      setTimeout(() => {
        setMode(mode);
      }, 750);
    },
    [playAmbience]
  );

  const renderMode = useCallback(() => {
    switch (mode) {
      case Mode.Practice:
        return <Practice setMode={delayedSetMode} />;
      case Mode.Climb:
        return <Climb setMode={delayedSetMode} />;
      case Mode.None:
      default:
        return <MainMenu setMode={delayedSetMode} />;
    }
  }, [delayedSetMode, mode]);

  const renderLeaves = useCallback(() => {
    const leaves = [];
    for (let x = 0; x < LEAF_QUANTITY; x++) {
      for (let y = 0; y < LEAF_QUANTITY; y++) {
        leaves.push(<Leaf key={`leaf-${x}-${y}`} x={x} y={y} />);
      }
    }
    return leaves;
  }, []);
  const leafClasses = classnames("App-leaves", {
    "App-leaves__up": leafPosition === LeafPosition.Up,
  });

  return (
    <div className="App">
      <SlashContextManager>
        <div className={leafClasses}>{renderLeaves()}</div>
        {renderMode()}
        <canvas width="1600px" height="200px" id="grass" />
      </SlashContextManager>
    </div>
  );
}

export default App;
