import classnames from "classnames";
import { useCallback, useEffect } from "react";
import { Phase, useSlash } from "../../useSlash";
import { parseResult } from "../../utils";
import { Rod } from "../rod";
import "./styles.css";

const LETTER_REGEX = /^[a-z]$/i;
const DEFAULT = ["j", "j", "f", "f", "k", "j", "f"];

export const Slash = () => {
  const slash = useSlash({
    sequence: DEFAULT,
  });

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (LETTER_REGEX.test(key) && !event.repeat) {
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

  const classes = classnames("Slash-rods", { fadeOut: slash.phase === Phase.Started });
  return (
    <div>
      {slash.phase === Phase.Ended && (
        <div>
          <div>Your attempt: {slash.attempt.join(" ")}</div>
          <div>Result: {parseResult(slash.result)}</div>
          <div>Press SPACE to restart</div>
        </div>
      )}
      <div className={classes}>
        {slash.sequence.map((_el, index) => (
          <Rod key={`rod-${index}`} slash={slash} index={index} />
        ))}
      </div>
    </div>
  );
};
