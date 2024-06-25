import { Time } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function TimeSVG({ width, height }: Props) {
  return <Time width={width} height={height} />;
}