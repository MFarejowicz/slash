import _ from "lodash";
import React, { useMemo } from "react";
import { Slash } from "../../useSlash";
import "./styles.css";

const ROD_WIDTH = 40;
const ROD_HEIGHT_MIN = 200;
const QUARTER_ROD_HEIGHT_MIN = ROD_HEIGHT_MIN / 4;
const ROD_HEIGHT_MAX = 210;

interface PublicProps {
  slash: Slash;
  index: number;
}

type Props = PublicProps;

export const Rod = ({ slash, index }: Props) => {
  const calculateVert = (index: number) => {
    const numRods = slash.sequence.length;
    // spread numRods elements over half the rod height
    const increment = (QUARTER_ROD_HEIGHT_MIN * 2) / numRods;
    // first should be highest up
    const inverseIndex = slash.sequence.length - index - 1;

    // ensure at least a quarter up
    return increment * inverseIndex + QUARTER_ROD_HEIGHT_MIN;
  };

  const el = slash.sequence[index];
  const height = useMemo(() => _.random(ROD_HEIGHT_MIN, ROD_HEIGHT_MAX), []);
  const vert = calculateVert(index);

  return (
    <div className="Rod" style={{ width: `${ROD_WIDTH}px`, height: `${height}px` }}>
      <span style={{ marginBottom: `${vert}px` }}>{el}</span>
    </div>
  );
};
