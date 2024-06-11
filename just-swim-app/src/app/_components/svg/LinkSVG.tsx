import Link_Icon from '@assets/link_icon.svg';

interface Props {
  width: number;
  height: number;
}

export default function LinkSVG({ width, height }: Props) {
  return (
    <>
      <Link_Icon width={width} height={height} />
    </>
  );
}
