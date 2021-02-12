import classnames from "classnames";
import { useCallback, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Leaf, LEAF_QUANTITY } from "./components/leaf";
import { Climb } from "./modes/climb";
import { MainMenu } from "./modes/main-menu";
import { Practice } from "./modes/practice";
import "./App.css";

library.add(fas, far);

export enum Mode {
  None = "none",
  Practice = "practice",
  Climb = "climb",
}

function App() {
  const [mode, setMode] = useState(Mode.None);
  const [flown, setFlown] = useState(false);

  const delayedSetMode = useCallback((mode: Mode) => {
    setFlown(mode === Mode.None ? false : true);
    setTimeout(() => setMode(mode), 750);
  }, []);

  const renderMode = () => {
    switch (mode) {
      case Mode.Practice:
        return <Practice setMode={delayedSetMode} />;
      case Mode.Climb:
        return <Climb setMode={delayedSetMode} />;
      case Mode.None:
      default:
        return <MainMenu setMode={delayedSetMode} />;
    }
  };

  const leafClasses = classnames("App-leaves", { "App-leaves__flown": flown });
  const renderLeaves = () => {
    const leaves = [];
    for (let x = 0; x < LEAF_QUANTITY; x++) {
      for (let y = 0; y < LEAF_QUANTITY; y++) {
        leaves.push(<Leaf key={`leaf-${x}-${y}`} x={x} y={y} />);
      }
    }
    return leaves;
  };

  return (
    <div className="App">
      <div className={leafClasses}>{renderLeaves()}</div>
      {renderMode()}
    </div>
  );
}

export default App;
