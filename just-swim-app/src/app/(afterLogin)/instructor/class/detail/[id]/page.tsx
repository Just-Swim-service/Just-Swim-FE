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
import { Header } from '@components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
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
        <form action="#">
          <input
            type="checkbox"
            id="confirmation-checkbox"
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="confirmation-checkbox">유의사항을 확인했습니다.</label>
        </form>
        <div className={styled.modal_button}>
          <button className={styled.button_cancel} onClick={onCancel}>
            취소
          </button>
          <button className={styled.button_ok} onClick={onConfirm}>
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
  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

  const [lecture, setLecture] = useState();
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
        if (data.data && data.data.lectureTime) {
          const lectureTime = data.data.lectureTime.split('-');
          setLecture({ ...data.data, lectureTime });
        } else {
          setLecture(data.data);
        }
      });
  }, [lectureId]);

  //  @ts-ignore
  if (!lecture || lecture.length === 0) {
    return <p>로딩 중</p>;
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

  return (
    <div>
      <Header
        title="수업 정보"
        editURL={`/instructor/class/edit/${lectureId}`}
      />

      <div className={styled.qr}>
        {/* @ts-ignore */}
        <h2>{lecture.lectureTitle}</h2>
        {/* @ts-ignore */}
        <div className={styled.desc}>{lecture.lectureTitle}</div>
        <div className={styled.instructor}>
          <Image
            // @ts-ignore
            src={lecture.instructor.instructorProfileImage}
            alt="프로필"
            width={24}
            height={24}
            style={{ borderRadius: '50% 50%', marginRight: '7px' }}
          />
          <div className={styled.instructor_name}>
            {/* @ts-ignore */}
            <p>{lecture.instructor.instructorName}</p> 강사님 수업
          </div>
        </div>
        <Image
          className={styled.qr_image}
          src={`/qrcode/${lectureId}`}
          alt="QR code"
          width={114}
          height={114}
        />
        <div className={styled.save_share}>
          <button
            className={styled.col}
            onClick={() => {
              const imageUrl = `${`/qrcode/${lectureId}`}`;
              const imageName = `qrcode.png`;
            }}>
            <div className={styled.circle}>
              <IconDownload />
            </div>
            <div>저장하기</div>
          </button>
          <button className={styled.col}>
            <div className={styled.circle}>
              <IconShare />
            </div>
            <div>공유하기</div>
          </button>
        </div>
      </div>

      <div className={styled.invite}>
        <h3>수강생 목록</h3>
        <div className={styled.student}>
          <div className={styled.count_box}>
            <p className={styled.personnel}>현재 인원</p>
            <p className={styled.count}>
              {/* @ts-ignore */}
              {lecture.members && lecture.members.length > 0
                ? // @ts-ignore
                  `${lecture.members.length}명`
                : '0명'}
            </p>
          </div>
          <div className={`${styled.profile} ${styled.box}`}>
            {/* @ts-ignore */}
            {lecture.members && lecture.members.length > 0 ? (
              <>
                {/* @ts-ignore */}
                {lecture.members.map((member, index) => (
                  <Image
                    key={index}
                    src={member.memberProfileImage}
                    alt="회원 프로필 사진"
                    width={32}
                    height={32}
                    style={{
                      borderRadius: '32px',
                      verticalAlign: 'middle',
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <p className={styled.profile_no}>
                  QR(수업 정보)을 공유해주세요!
                </p>
              </>
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
                {/* @ts-ignore */}
                {parseInt(lecture.lectureTime[0], 10) >= 12 ? `PM ` : `AM `}
              </span>
              {/* @ts-ignore */}
              {lecture.lectureTime[0]}
            </div>
            <span className={styled.wave}>~</span>
            <div>
              <span className={styled.twelve}>
                {/* @ts-ignore */}
                {parseInt(lecture.lectureTime[0], 10) >= 12 ? `PM ` : `AM `}
              </span>
              {/* @ts-ignore */}
              {lecture.lectureTime[1]}
            </div>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconCalendar />
              </span>
              매주&nbsp;
              {/* @ts-ignore */}
              {lecture.lectureDays.replace(/(.)(?=.)/g, '$1, ')}요일
            </p>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconLocation />
              </span>
              {/* @ts-ignore */}
              {lecture.lectureLocation}
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
                //  @ts-ignore
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
          <IconTrashcan />
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
        {lecture.members.memberUserId === 0 ? (
          <></>
        ) : (
          <Link
            className={styled.feedback_btn}
            href={{
              pathname: `/instructor/feedback/create/class`,
              query: {
                id: lectureId,
                // @ts-ignore
                member: lecture.members
                  // @ts-ignore
                  .map((member) => member.memberUserId)
                  .join(','),
              },
            }}
            as={`/instructor/feedback/create/class`}>
            수강생 전체 피드백 남기기
          </Link>
        )}
      </div>
      <div className={styled.bottom_gap}></div>
    </div>
  );
}
