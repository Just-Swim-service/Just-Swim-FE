import { RepeatTime } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function RepeatTimeSVG({ width, height }: Props) {
  return <RepeatTime width={width} height={height} />;
}