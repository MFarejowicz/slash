import classnames from "classnames";
import { useCallback } from "react";
import useEventListener from "@use-it/event-listener";
import { parseResult } from "../../utils/parseResult";
import { Phase, Result, Sequence, useSlash } from "../../utils/useSlash";
import { Rod } from "../rod";
import "./styles.css";

const LETTER_REGEX = /^[a-z]$/i;

interface PublicProps {
  sequence: Sequence;
  maxTime?: number;
  onRestart?: () => void;
  onAdvance?: () => void;
}

type Props = PublicProps;

export const Slash = (props: Props) => {
  const { sequence, maxTime, onRestart, onAdvance } = props;
  const slash = useSlash({ sequence, maxTime });

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!event.repeat && LETTER_REGEX.test(key)) {
        slash.start(); // slash handles checking if ready
        slash.add(key); // slash handles checking if not finished
      }

      if (!event.repeat && slash.phase === Phase.Ended) {
        switch (key) {
          case " ":
            slash.reset();
            onRestart?.();
            break;
          case "enter":
            if (slash.result === Result.Success) {
              slash.reset();
              onAdvance?.();
            }
            break;
          default:
            break;
        }
      }
    },
    [slash, onRestart, onAdvance]
  );

  useEventListener("keydown", onKeyDown);

  const classes = classnames("Slash-rods", { fadeOut: slash.phase === Phase.Started });
  return (
    <div>
      {slash.phase === Phase.Ended && (
        <div>
          <div>Your attempt: {slash.attempt.join(" ")}</div>
          <div>Result: {parseResult(slash.result)}</div>
          <div>
            Time: {slash.time}, Max: {props.maxTime}
          </div>
          <div>Press SPACE to try again</div>
          {slash.result === Result.Success && <div>Press ENTER to continue</div>}
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
