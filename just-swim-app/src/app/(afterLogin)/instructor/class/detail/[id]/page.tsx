'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
  IconTrashcan,
  IconClock,
  IconCalendar,
  IconLocation,
  IconRepeat,
  IconArrowRight,
} from '@assets';
import { Header } from '@components';
import { LectureViewProps } from '@types';

import { QRCode } from '@/(afterLogin)/schedule/(general)/add/complete/[id]/_components';

import dayjs from 'dayjs';
import styled from './classDetail.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styled.delete_modal}>
        <h3>수업을 삭제하시겠습니까?</h3>
        <p>
          삭제된 수업은 복구되지 않으며,
          <br />
          해당 수강생의 화면에서도 삭제됩니다.
        </p>
        <form>
          <input
            type="checkbox"
            id="confirmation-checkbox"
            style={{ marginRight: '8px' }}
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="confirmation-checkbox">유의사항을 확인했습니다.</label>
        </form>
        <div className={styled.modal_button}>
          <button className={styled.button_cancel} onClick={onCancel}>
            취소
          </button>
          <button
            className={styled.button_ok}
            onClick={handleConfirm}
            disabled={!isChecked}>
            수업 삭제
          </button>
        </div>
      </div>
      <div className={styled.overlay}></div>
    </>
  );
};

export default function ClassDetail() {
  const params = useParams();
  const router = useRouter();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_TOKEN}`;

  const [lecture, setLecture] = useState<LectureViewProps | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const lectureTime = data.data.lectureTime
            ? data.data.lectureTime.split('-')
            : [];
          setLecture({ ...data.data, lectureTime });
        }
      });
  }, [lectureId]);

  //  @ts-ignore
  if (!lecture || lecture.length === 0) {
    return null;
  }

  const DeleteHandler = async () => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTHORIZATION_HEADER,
        },
      });

      if (!response.ok) {
        throw new Error('수업 삭제 실패');
      }

      alert('수업 삭제 성공');
      setShowConfirmModal(false);
      router.push('/instructor/class');
    } catch (error) {
      console.error('수업 삭제 오류 발생', error);
      alert('수업 삭제에 실패하였습니다. 관리자에게 문의하세요.');
    }
  };

  const lectureTime = lecture.lectureTime || ['', ''];

  return (
    <div>
      <Header
        title="수업 정보"
        editURL={`/instructor/class/edit/${lectureId}`}
      />

      <div className={styled.qr}>
        <h2>{lecture.lectureTitle}</h2>
        <div className={styled.desc}>{lecture.lectureTitle}</div>
        {lecture.instructor && (
          <QRCode
            lectureData={{
              // @ts-ignore
              title: lecture.lectureTitle,
              content: lecture.lectureContent,
            }}
            instructorData={{
              // @ts-ignore
              name: lecture.instructor.instructorName,
              // @ts-ignore
              image: lecture.instructor.instructorProfileImage,
            }}
            style={{ backgroundColor: '#fff' }}
          />
        )}
      </div>

      <div className={styled.invite}>
        <h3>수강생 목록</h3>
        <div className={styled.student}>
          <div className={styled.count_box}>
            <p className={styled.personnel}>현재 인원</p>
            <p className={styled.count}>
              {lecture.members?.length ? `${lecture.members.length}명` : '0명'}
            </p>
          </div>
          <Link
            className={`${styled.profile} ${styled.box}`}
            href={`/instructor/class/detail/${lectureId}/members`}>
            {lecture.members && lecture.members.length > 0 ? (
              <>
                <div className={styled.profile_position}>
                  {lecture.members.slice(-7).map((member, index) => (
                    <Image
                      key={index}
                      src={member.profileImage}
                      alt="회원 프로필 사진"
                      width={32}
                      height={32}
                      style={{
                        borderRadius: '32px',
                        verticalAlign: 'middle',
                      }}
                    />
                  ))}
                </div>
                <div className={styled.arrow_box}>
                  <IconArrowRight width={20} height={20} fill="black" />
                </div>
              </>
            ) : (
              <>
                <p className={styled.profile_no}>
                  QR(수업 정보)을 공유해주세요!
                </p>
              </>
            )}
          </Link>
        </div>
      </div>

      <div className={styled.class}>
        <h3>수업 정보</h3>

        <div className={styled.class_info}>
          <div className={styled.class_time}>
            <div>
              <span className={styled.icon}>
                <IconClock width={20} height={20} fill="#212223" />
              </span>
              <span className={styled.twelve}>
                {parseInt(lecture.lectureTime[0], 10) >= 12 ? `PM ` : `AM `}
              </span>
              {lectureTime[0]}
            </div>
            <span className={styled.wave}>~</span>
            <div>
              <span className={styled.twelve}>
                {parseInt(lecture.lectureTime[0], 10) >= 12 ? `PM ` : `AM `}
              </span>
              {lectureTime[1]}
            </div>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconCalendar width={20} height={20} fill="#212223" />
              </span>
              매주 {lecture.lectureDays.replace(/(.)(?=.)/g, '$1, ')}요일
            </p>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconLocation width={20} height={20} fill="#212223" />
              </span>
              {lecture.lectureLocation}
            </p>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconRepeat width={20} height={20} fill="#212223" />
              </span>
              {lecture.lectureEndDate ? (
                <>
                  {dayjs(lecture.lectureEndDate).format('YYYY년 MM월 DD일')} 종료
                </>
              ) : (
                <span>종료일 없이 반복</span>
              )}
            </p>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span
                className={styled.color_box}
                style={{ backgroundColor: `${lecture.lectureColor}` }}></span>
              구분색
            </p>
          </div>

          <div className={styled.color_input}></div>
        </div>
      </div>
      <div className={styled.button_box}>
        <button
          className={styled.delete}
          onClick={() => setShowConfirmModal(true)}>
          <IconTrashcan width={24} height={24} fill="#FF4D4D" />
          수업 삭제
        </button>

        {showConfirmModal && (
          <ConfirmModal
            isOpen={showConfirmModal}
            onConfirm={async () => {
              await DeleteHandler();
              setShowConfirmModal(false);
            }}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        {/* @ts-ignore */}
        {lecture.members.length === 0 ? (
          <></>
        ) : (
          <div className={styled.feedback_bg}>
            <Link
              className={styled.feedback_btn}
              href={{
                pathname: `/instructor/feedback/create/class`,
                query: {
                  id: lectureId,
                  // @ts-ignore
                  member: lecture.members
                    .map((member) => member.memberUserId)
                    .join(','),
                },
              }}
              as={`/instructor/feedback/create/class`}>
              수강생 전체 피드백 남기기
            </Link>
          </div>
        )}
      </div>
      <div className={styled.bottom_gap}></div>
    </div>
  );
}
