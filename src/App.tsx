import classnames from "classnames";
import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import forest from "./assets/audio/forest.mp3";
import { Leaf, LEAF_QUANTITY } from "./components/leaf";
import { wavingGrass } from "./grass";
import { Climb } from "./modes/climb";
import { MainMenu } from "./modes/main-menu";
import { Practice } from "./modes/practice";
import "./App.css";

export enum Mode {
  None = "None",
  Practice = "Practice",
  Climb = "Climb",
}

export const MODE_ORDER = [Mode.Practice, Mode.Climb];

library.add(fas, far);

function App() {
  const [mode, setMode] = useState(Mode.None);
  const [flown, setFlown] = useState(false);
  const [isTransition, setIsTranstion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playAmbience] = useSound(forest, { loop: true });

  const delayedSetMode = useCallback((mode: Mode) => {
    setHasInteracted(true);
    setFlown(mode === Mode.None ? false : true);
    setIsTranstion(true);
    setTimeout(() => {
      setIsTranstion(false);
      setMode(mode);
    }, 750);
  }, []);

  const renderMode = () => {
    switch (mode) {
      case Mode.Practice:
        return <Practice isTransition={isTransition} setMode={delayedSetMode} />;
      case Mode.Climb:
        return <Climb setMode={delayedSetMode} />;
      case Mode.None:
      default:
        return (
          <MainMenu
            isTransition={isTransition}
            setHasInteracted={setHasInteracted}
            setMode={delayedSetMode}
          />
        );
    }
  };

  const leafClasses = classnames("App-leaves", { "App-leaves__flown": flown });
  const leaves = [];
  for (let x = 0; x < LEAF_QUANTITY; x++) {
    for (let y = 0; y < LEAF_QUANTITY; y++) {
      leaves.push(<Leaf key={`leaf-${x}-${y}`} x={x} y={y} />);
    }
  }

  useEffect(() => {
    if (hasInteracted) {
      // playAmbience();
    }
  }, [hasInteracted, playAmbience]);

  useEffect(() => {
    wavingGrass();
  }, []);

  return (
    <div className="App">
      <div className={leafClasses}>{leaves}</div>
      {renderMode()}
      <canvas width="1600px" height="200px" id="grass" />
    </div>
  );
}

export default App;
