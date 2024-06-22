import { ArrowDown } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function ArrowDownSVG({ width, height }: Props) {
  return <ArrowDown width={width} height={height} />;
}