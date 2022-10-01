import classnames from "classnames";
import { useCallback } from "react";
import { Phase, Result, useSlash } from "../../contexts/slash-context";
import { parseResult } from "../../utils/parseResult";
import { useKeyPress } from "../../utils/useKeyPress";
import { Rod } from "../rod";
import "./styles.css";

const LETTER_REGEX = /^[a-z]$/i;

export const Slash = () => {
  const slash = useSlash();

  const onKeyDown = useCallback(
    (key: string) => {
      if (LETTER_REGEX.test(key)) {
        slash.add(key);
      }
    },
    [slash]
  );

  useKeyPress(onKeyDown);

  const classes = classnames("Slash-rods", { fadeOut: slash.phase === Phase.Started });
  return (
    <div>
      {slash.phase === Phase.Ended && (
        <div>
          <div>Your attempt: {slash.attempt.join(" ")}</div>
          <div>Result: {parseResult(slash.result)}</div>
          <div>
            Time: {slash.time}, Max: {slash.maxTime}
          </div>
          <div>Press SPACE to try again</div>
          {slash.result === Result.Success && <div>Press ENTER to continue</div>}
        </div>
      )}
      <div className={classes}>
        {slash.sequence.map((_el, index) => (
          <Rod key={`rod-${index}`} sequence={slash.sequence} index={index} />
        ))}
      </div>
    </div>
  );
};
