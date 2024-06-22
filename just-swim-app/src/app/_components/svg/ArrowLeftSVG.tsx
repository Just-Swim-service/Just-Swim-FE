import { ArrowLeft } from "@assets";

interface Props {
  width: number;
  height: number;
}

export function ArrowLeftSVG({ width, height }: Props) {
  return <ArrowLeft width={width} height={height} />;
}