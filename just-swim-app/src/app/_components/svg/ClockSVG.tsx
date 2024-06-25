import { Clock } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function ClockSVG({ width, height }: Props) {
  return <Clock width={width} height={height} />;
}