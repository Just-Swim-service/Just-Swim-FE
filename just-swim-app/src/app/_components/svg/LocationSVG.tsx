import { Location } from "@assets";

interface SVGProps {
  width: number;
  height: number;
}

export function LocationSVG({ width, height }: SVGProps) {
  return <Location width={width} height={height} />;
}