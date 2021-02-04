import { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
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

  const renderMode = () => {
    switch (mode) {
      case Mode.Practice:
        return <Practice setMode={setMode} />;
      case Mode.Climb:
        return <Climb setMode={setMode} />;
      case Mode.None:
      default:
        return <MainMenu setMode={setMode} />;
    }
  };

  return <div className="App">{renderMode()}</div>;
}

export default App;
