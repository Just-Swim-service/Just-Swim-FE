import { InputValid } from "@assets";

interface SVGProps {
  width: number;
  height: number;
}

export function InputValidSVG({ width, height }: SVGProps) {
  return <InputValid width={width} height={height} />;
}