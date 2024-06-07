import Image from 'next/image';
import Link from 'next/link';
import profile from '/public/assets/profile1.png';
import QRCode from '/public/assets/qr_code.png';
import downloadIcon from '/public/assets/icon_download.png';
import shareIcon from '/public/assets/icon_share.png';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';
import Profile from '../../../_component/Profile';
import arrowRightIcon from '/public/assets/icon_arrow_right.png';
import ClassInfo from '../../../_component/ClassInfo';
import deleteIcon from '/public/assets/icon_delete.png';
import styled from './classDetail.module.scss';
import Header from '@/app/_component/Header';

// 수업 참여자 리스트
let peopleList = [
  {
    name: 'hyebin',
    profile: 'profile1',
  },
  {
    name: 'hyebin',
    profile: '',
  },
  {
    name: 'hyebin',
    profile: 'profile1',
  },
  {
    name: 'hyebin',
    profile: 'profile1',
  },
  {
    name: 'hyebin',
    profile: 'profile1',
  },
  {
    name: 'hyebin',
    profile: 'profile1',
  },
  {
    name: 'hyebin',
    profile: 'profile1',
  },
];

export default function ClassDetail() {
  return (
    <div className={styled.class_detail}>
      <Header
        title="수업 정보"
        editURL="/instructor/classList/classDetail/edit"
      />
      {/* <div className={styled.header}>
        <div className="row">
          <Image src={arrowBackIcon} alt="뒤로가기" />
          <div>수업 정보</div>
        </div>
        <Link
          href="/instructor/classList/classDetail/edit"
          className={styled.edit}>
          수정하기
        </Link>
      </div> */}

      <div className={styled.qr}>
        <h2>아침 5반</h2>
        <div className={styled.desc}>
          초보반으로, 배영 및 접영 위주로 수업합니다.
        </div>

        <div className={styled.instructor}>
          <Image src={profile} alt="프로필" width={24} height={24} />
          <div>홍길동 강사님 수업</div>
        </div>

        <Image className={styled.qr_image} src={QRCode} alt="qr" />

        <div className={styled.save_share}>
          <div className={styled.col}>
            <div className={styled.circle}>
              <Image src={downloadIcon} alt="저장" />
            </div>
            <div>저장하기</div>
          </div>

          <div className={styled.col}>
            <div className={styled.circle}>
              <Image src={shareIcon} alt="공유" />
            </div>
            <div>공유하기</div>
          </div>
        </div>
      </div>

      <div className={styled.invite}>
        <h3>초대된 수강생</h3>
        <div className={styled.student}>
          <div className={`${styled.count} ${styled.box}`}>
            <div>현재 인원</div>
            <div>{'15명'}</div>
          </div>
          <div className={`${styled.profile} ${styled.box}`}>
            {peopleList.length > 0 ? (
              <>
                <Profile
                  customers={peopleList}
                  width={32}
                  height={32}
                  xMargin={-5}
                />
                <Image
                  src={arrowRightIcon}
                  alt="arrow right"
                  width={20}
                  height={20}
                />
              </>
            ) : (
              <div className={styled.profile_no}>
                QR(수업 정보)을 공유해주세요!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styled.class_info}>
        <h3>수업 정보</h3>
        <ClassInfo islabel={false} bgColor="white" />

        <button className={styled.class_info_delete}>
          <Image src={deleteIcon} alt="수업 삭제" width={24} height={24} />
          <div>수업 삭제</div>
        </button>
        <button className={styled.feedback_btn}>
          수강생 전체 피드백 남기기
        </button>
      </div>
    </div>
  );
}
