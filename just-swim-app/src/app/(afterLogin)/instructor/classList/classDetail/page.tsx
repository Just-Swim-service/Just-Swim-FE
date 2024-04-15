import Image from 'next/image';
import Link from 'next/link';
import profile from '/public/assets/profile1.png';
import QRCode from '/public/assets/qr_code.png';
import downloadIcon from '/public/assets/icon_download.png';
import shareIcon from '/public/assets/icon_share.png';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';
import './classDetail.scss';
import Profile from '../../../_component/Profile';
import arrowRightIcon from '/public/assets/icon_arrow_right.png';
import ClassInfo from '../../../_component/ClassInfo';
import deleteIcon from '/public/assets/icon_delete.png';

export default function ClassDetail() {
  return (
    <div className="container">
      <div className="header">
        <div className="row">
          <Image src={arrowBackIcon} alt="뒤로가기" />
          <div>수업 정보</div>
        </div>
        <Link href="/instructor/classList/classDetail/edit" className="edit">
          수정하기
        </Link>
      </div>

      <div className="qr">
        <h2>아침 5반</h2>
        <div className="desc">초보반으로, 배영 및 접영 위주로 수업합니다.</div>

        <div className="instructor">
          <Image src={profile} alt="프로필" />
          <div>홍길동 강사님 수업</div>
        </div>

        <Image className="qr_image" src={QRCode} alt="qr" />

        <div className="save_share">
          <div className="col">
            <div className="circle">
              <Image src={downloadIcon} alt="저장" />
            </div>
            <div>저장하기</div>
          </div>

          <div className="col">
            <div className="circle">
              <Image src={shareIcon} alt="공유" />
            </div>
            <div>공유하기</div>
          </div>
        </div>
      </div>

      <div className="invite">
        <h3>초대된 수강생</h3>
        <div className="student">
          <div className="count box">
            <div>현재 인원</div>
            <div>{'15명'}</div>
          </div>
          <div className="profile box">
            <Profile />
            <Image
              src={arrowRightIcon}
              alt="arrow right"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      <div className="class_info">
        <h3>수업 정보</h3>
        <ClassInfo />

        <button className="class_info_delete">
          <Image src={deleteIcon} alt="수업 삭제" width={24} height={24} />
          <div>수업 삭제</div>
        </button>
        <button className="feedback_btn">수강생 전체 피드백 남기기</button>
      </div>
    </div>
  );
}
