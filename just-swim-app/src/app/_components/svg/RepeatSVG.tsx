import { Repeat } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function RepeatSVG({ width, height }: Props) {
  return <Repeat width={width} height={height} />;
}