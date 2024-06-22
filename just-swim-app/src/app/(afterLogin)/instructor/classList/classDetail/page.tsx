'use client';

import Image from 'next/image';
import profile from '/public/assets/profile1.png';
import QRCode from '/public/assets/qr_code.png';
import downloadIcon from '/public/assets/icon_download.png';
import shareIcon from '/public/assets/icon_share.png';
import { Profile } from '@components';
import arrowRightIcon from '/public/assets/icon_arrow_right.png';
import { ClassInfo } from '@components';
import deleteIcon from '/public/assets/icon_delete.png';
import styled from './classDetail.module.scss';
import { Header } from '@components';
import location_icon from '/public/assets/input_icon_location.png';
import { ColorModal } from '@components';
import { Datepicker } from '@components';
import { Timepicker } from '@components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RepeatDatepicker } from '@components';

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
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  // const clickModal = () => setShowModal(!showModal);
  const clickModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className={styled.class_detail}>
      <Header
        title="수업 정보"
        editURL="/instructor/classList/classDetail/edit"
      />

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

      <div className={styled.class}>
        <h3>수업 정보</h3>
        {/* <ClassInfo islabel={false} bgColor="white" /> */}

        <div className={styled.classInfo}>
          <div className={styled.classInfo_time}>
            <Timepicker label="시작" />
            ~
            <Timepicker label="끝" />
          </div>
          {/* hyebin 매주 요일 지정 구현하기 */}

          <Datepicker />

          <div className={styled.location_input}>
            <input
              id="location"
              className={`${styled.input} ${styled.white}`}
              placeholder="강동구 실내 수영장"
              onClick={() => router.push('edit/search')}
            />
            <Image
              src={location_icon}
              alt="location icon"
              width={20}
              height={20}
              className={styled.locatin_icon}
            />
          </div>

          <RepeatDatepicker />

          <div className={styled.color_input}>
            <input
              className={`${styled.input} ${styled.white}`}
              onClick={clickModal}
              placeholder="구분색"></input>
            <div className={styled.pick_color} />
          </div>
          {showModal && (
            <ColorModal showModal={showModal} setShowModal={setShowModal} />
          )}
        </div>

        <button className={styled.delete}>
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
