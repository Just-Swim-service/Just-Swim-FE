import { Plus } from "@assets";

interface SVGProps {
  width: number;
  height: number;
}

export function PlusSVG({ width, height }: SVGProps) {
  return <Plus width={width} height={height} />;
}