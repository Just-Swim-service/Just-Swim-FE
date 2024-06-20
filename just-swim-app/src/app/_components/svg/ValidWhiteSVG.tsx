import { ValidWhite } from "@assets";

interface SVGProps {
  width: number;
  height: number;
}

export function ValidWhiteSVG({ width, height }: SVGProps) {
  return <ValidWhite width={width} height={height} />;
}