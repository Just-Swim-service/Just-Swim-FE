import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';
import './header2.scss';
import Link from 'next/link';

interface Props {
  leftContent?: string;
  rightContent?: string;
  feedback: { class: string; dataUrl: string };
}
export default function Header({ leftContent, rightContent, feedback }: Props) {
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
        {/* Feedback 객체 정보로 url 로 링크 연결하기 */}
        <Link href={`/`}>
          <div className="rightLink">{rightContent}</div>
        </Link>
      </header>
    </>
  );
}
