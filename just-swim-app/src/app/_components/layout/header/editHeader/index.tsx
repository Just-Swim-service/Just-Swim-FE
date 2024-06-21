import Link from 'next/link';
import Image from 'next/image';

import arrowBackIcon from '@assets/icon_arrow_back.png';

import './styles.scss';

// Link href= 에 들어갈 url 을 받아온다고 생각했습니다.
type Data = {
  dataUrl?: string;
  name?: string;
};

interface Props {
  leftContent?: string;
  data?: Data;
}
export function EditHeader({ leftContent, data }: Props) {
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
