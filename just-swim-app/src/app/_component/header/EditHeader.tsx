import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';
import './header.scss';
import Link from 'next/link';

// Link href= 에 들어갈 url 을 받아온다고 생각했습니다.
type Data = {
  dataUrl: string;
};

interface Props {
  leftContent?: string;
  data: Data;
}
export default function EditHeader({ leftContent, data }: Props) {
  return (
    <>
      <div className="edit_header">
        <div className="left_content">
          <Link href={`/`}>
            <div className="left_link">
              <Image src={arrowBackIcon} alt="뒤로가기" />
            </div>
          </Link>
          {leftContent}
        </div>
        <Link href={`/`}>
          <div className="link_to_edit">수정하기</div>
        </Link>
      </div>
    </>
  );
}
