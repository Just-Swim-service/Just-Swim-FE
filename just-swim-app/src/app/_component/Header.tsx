import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';

import './header.scss';

interface Props {
  title: string;
}
export default function Header({ title }: Props) {
  return (
    <header>
      <Image src={arrowBackIcon} alt="뒤로가기" />
      <div>{title}</div>
    </header>
  );
}
