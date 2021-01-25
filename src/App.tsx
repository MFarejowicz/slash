import { useCallback, useEffect } from "react";
import { Phase, useSlash } from "./useSlash";
import { parseResult } from "./utils";
import "./App.css";

const LETTER = /[a-z]/i;
const DEFAULT = ["j", "j", "f", "f", "k", "j", "f"];

function App() {
  const slash = useSlash({ sequence: DEFAULT });

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (LETTER.test(key) && !event.repeat) {
        slash.start(); // slash handles checking if ready
        slash.add(key); // slash handles checking if not finished
      }

      if (key === " " && !event.repeat) {
        slash.reset();
      }
    },
    [slash]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="App">
      <div>Way of the Slash!</div>
      <div className={slash.phase === Phase.Started ? "fadeOut" : ""}>
        {slash.sequence.join(" ")}
      </div>
      {slash.phase === Phase.Ended && (
        <div>
          <div>Your attempt: {slash.attempt.join(" ")}</div>
          <div>Result: {parseResult(slash.result)}</div>
          <div>Press SPACE to restart</div>
        </div>
      )}
    </div>
  );
}

export default App;
