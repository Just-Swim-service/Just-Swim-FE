'use client';

import Image from 'next/image';
import styled from './classDetail.module.scss';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  IconTrashcan,
  IconClock,
  IconCalendar,
  IconLocation,
  IconRepeat,
  IconShare,
  IconDownload,
} from '@assets';
import { DeleteModal, Header } from '@components';
import QRCode from '/public/assets/qr_code.png';

export default function ClassDetail() {
  const params = useParams();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

  const [lecture, setLecture] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLecture(data.data);
      })
      .catch((error) => {
        console.error('API error:', error);
        setError(error);
      });
  }, []);

  const lectureData = lecture.map((item) => ({
    lectureId: item.lectureId,
    lectureTitle: item.lectureTitle,
    lectureContent: item.lectureContent,
    lectureTime: item.lectureTime ? item.lectureTime.split('-') : [],
    lectureDays: item.lectureDays.replace(/(.)(?=.)/g, '$1, '),
    lectureLocation: item.lectureLocation,
    lectureColor: item.lectureColor,
    lectureQRCode: item.lectureQRCode,
    lectureEndDate: item.lectureEndDate,
    instructorName: item.instructorName,
    instructorProfileImage: item.instructorProfileImage,
    memberUserId: item.memberUserId,
    memberProfileImage: item.memberProfileImage,
  }));

  if (error) {
    console.error('API error:', error);
    return <p>API 오류 발생</p>;
  }

  if (!lecture || lecture.length === 0) {
    return <p>데이터 로딩 중...</p>;
  }

  const handleDeleteClass = async () => {
    try {
      const response = await fetch(`${API_URL}/${lectureId}`, {
        method: 'DELETE',
        headers: {
          Authorization: AUTHORIZATION_HEADER,
          'Content-Type': 'application/json', // 선택적 (데이터가 JSON일 경우)
        },
      });

      if (!response.ok) {
        throw new Error('수업 삭제 실패');
      }

      // 삭제 성공 처리 (예: state 업데이트, 모달 닫기)
      setLecture(lecture.filter((item) => item.lectureId !== lectureId));
      setShowConfirmModal(false);
    } catch (error) {
      console.error('수업 삭제 오류:', error);
      // 에러 처리 (예: 사용자에게 오류 메시지 표시)
    }
  };

  const handleDeleteButtonClick = () => {
    return (
      <DeleteModal
        showModal={true}
        setShowModal={setShowConfirmModal}
        onDelete={handleDeleteClass}
      />
    );
  };

  return (
    <div>
      <Header
        title="수업 정보"
        editURL={`/instructor/class/edit/${lectureId}`}
      />

      {lectureData.map((item) => (
        <>
          <div className={styled.qr}>
            <h2>{item.lectureTitle}</h2>
            <div className={styled.desc}>{item.lectureTitle}</div>

            <div className={styled.instructor}>
              <Image
                src={item.instructorProfileImage}
                alt="프로필"
                width={24}
                height={24}
                style={{ borderRadius: '50% 50%', marginRight: '7px' }}
              />
              <div>{item.instructorName} 강사님 수업</div>
            </div>

            <Image className={styled.qr_image} src={QRCode} alt="qr" />

            <div className={styled.save_share}>
              <div className={styled.col}>
                <div className={styled.circle}>
                  <IconDownload />
                </div>
                <div>저장하기</div>
              </div>
              <div className={styled.col}>
                <div className={styled.circle}>
                  <IconShare />
                </div>
                <div>공유하기</div>
              </div>
            </div>
          </div>

          <div className={styled.invite}>
            <h3>수강생 목록</h3>
            <div className={styled.student}>
              <div className={styled.count_box}>
                <p className={styled.personnel}>현재 인원</p>
                <p className={styled.count}>
                  {item.memberUserId == 0 ? `0명` : `1명`}
                </p>
              </div>
              <div className={`${styled.profile} ${styled.box}`}>
                {item.memberUserId == 0 ? (
                  <div className={styled.profile_no}>
                    QR(수업 정보)을 공유해주세요!
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div className={styled.class}>
            <h3>수업 정보</h3>

            <div className={styled.class_info}>
              <div className={styled.class_time}>
                <div>
                  <span className={styled.icon}>
                    <IconClock />
                  </span>
                  <span className={styled.twelve}>
                    {parseInt(item.lectureTime[0], 10) >= 12 ? `PM` : `AM`}
                  </span>
                  {item.lectureTime[0]}
                </div>
                ~
                <div>
                  <span className={styled.twelve}>
                    {parseInt(item.lectureTime[0], 10) >= 12 ? `PM` : `AM`}
                  </span>
                  {item.lectureTime[1]}
                </div>
              </div>

              <div className={styled.lecture_info}>
                <p>
                  <span className={styled.icon}>
                    <IconCalendar />
                  </span>
                  매주&nbsp;
                  {item.lectureDays}요일
                </p>
              </div>

              <div className={styled.lecture_info}>
                <p>
                  <span className={styled.icon}>
                    <IconLocation />
                  </span>
                  {item.lectureLocation}
                </p>
              </div>

              <div className={styled.lecture_info}>
                <p>
                  <span className={styled.icon}>
                    <IconRepeat />
                  </span>
                  종료일 없이 반복
                </p>
              </div>

              <div className={styled.lecture_info}>
                <p>
                  <span
                    className={styled.color_box}
                    style={{ backgroundColor: `${item.lectureColor}` }}></span>
                  구분색
                </p>
              </div>

              <div className={styled.color_input}></div>
            </div>

            <button className={styled.delete}>
              <IconTrashcan />
              수업 삭제
            </button>

            {item.memberUserId == 0 ? (
              <></>
            ) : (
              <button className={styled.feedback_btn}>
                수강생 전체 피드백 남기기
              </button>
            )}
          </div>
        </>
      ))}
    </div>
  );
}
