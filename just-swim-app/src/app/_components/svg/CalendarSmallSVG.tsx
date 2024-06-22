import { CalendarSmall } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function CalendarSmallSVG({ width, height }: Props) {
  return <CalendarSmall width={width} height={height} />;
}