import styled from './qr.module.scss';

import Image from 'next/image';
// TODO: svg 로 바꾸기
import Profile from '@assets/profile1.png';
import QRCode from '@assets/qr_code.png';
import DownloadIcon from '@assets/icon_download.png';
import ShareIcon from '@assets/icon_share.png';

export default function QrSection() {
  return (
    <>
      <div className={styled.qr_section}>
        <h2 className={styled.class_name}>아침 5반</h2>
        <div className={styled.class_description}>
          초보반으로, 배영 및 접영 위주로 수업합니다.
        </div>

        <div className={styled.instructor}>
          <Image src={Profile} alt="프로필" />
          <div>홍길동 강사님 수업</div>
        </div>

        <Image className={styled.qr_image} src={QRCode} alt="qr" />

        <div className={styled.qr_save_share}>
          <div className={styled.qr_save}>
            <div className={styled.circle}>
              <Image src={DownloadIcon} alt="저장" />
            </div>
            <div>저장하기</div>
          </div>

          <div className={styled.qr_share}>
            <div className={styled.circle}>
              <Image src={ShareIcon} alt="공유" />
            </div>
            <div>공유하기</div>
          </div>
        </div>
      </div>
    </>
  );
}
