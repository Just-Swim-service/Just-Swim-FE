import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';
import './header.scss';
import Link from 'next/link';

type Data = {
  dataUrl: string;
};

interface Props {
  leftContent?: string;
  data: Data;
}
export default function FixHeader({ leftContent, data }: Props) {
  return (
    <>
      <header>
        <div className="leftContent">
          <Link href={`/`}>
            <div className="leftLink">
              <Image src={arrowBackIcon} alt="뒤로가기" />
            </div>
          </Link>
          {leftContent}
        </div>
        <Link href={`/`}>
          <div className="linkToFix">수정하기</div>
        </Link>
      </header>
    </>
  );
}
