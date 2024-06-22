import { ArrowRight } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function ArrowRightSVG({ width, height }: Props) {
  return <ArrowRight width={width} height={height} />;
}