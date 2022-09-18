import { random } from "lodash";
import { useMemo } from "react";
import "./styles.css";

const OFFSET_MIN = -3;
const OFFSET_MAX = 3;
export const LEAF_QUANTITY = 15;
export const LEAF_GAP = 100 / LEAF_QUANTITY;

interface PublicProps {
  x: number;
  y: number;
}

type Props = PublicProps;

export const Leaf = ({ x, y }: Props) => {
  const leftOffset = useMemo(() => random(OFFSET_MIN, OFFSET_MAX, true), []);
  const left = `${x * LEAF_GAP + leftOffset}vw`;

  const topOffset = useMemo(() => random(OFFSET_MIN, OFFSET_MAX, true), []);
  const top = `${y * LEAF_GAP + topOffset}vh`;

  return <div className="Leaf" style={{ top, left }} />;
};
