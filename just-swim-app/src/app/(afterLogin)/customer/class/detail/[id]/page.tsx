'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
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
import { fetchJson } from '@utils';

export default function ClassDetail() {
  const params = useParams();
  const lectureId = params.id;

  const [lecture, setLecture] = useState<LectureViewProps | null>(null);

  const fetchLectureData = async () => {
    try {
      const res = await fetchJson<{ data: LectureViewProps }>(
        `/lecture/${lectureId}`,
      );
      const lectureTime = res.data.lectureTime?.split('-') || [];
      setLecture(res.data);
    } catch (error) {
      console.error('Failed to fetch lecture data', error);
    }
  };

  useEffect(() => {
    fetchLectureData();
  }, [lectureId]);

  if (!lecture) {
    return null;
  }

  //  @ts-ignore
  const [startTime, endTime] =
    typeof lecture.lectureTime === 'string'
      ? lecture.lectureTime.split('-')
      : ['', ''];

  const lectureDayString = lecture.lectureDays.replace(/(.)(?=.)/g, '$1, ');

  return (
    <div>
      <Header title="수업 정보" />

      <div className={styled.qr}>
        <h2>{lecture.lectureTitle}</h2>
        <div className={styled.desc}>{lecture.lectureTitle}</div>
        {lecture.instructor && (
          <QRCode
            lectureData={{
              //  @ts-ignore
              title: lecture.lectureTitle,
              content: lecture.lectureContent,
            }}
            instructorData={{
              //  @ts-ignore
              name: lecture.instructor.instructorName,
              //  @ts-ignore
              image: lecture.instructor.instructorProfileImage,
            }}
            style={{ backgroundColor: '#fff' }}
          />
        )}
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
                {parseInt(startTime, 10) >= 12 ? 'PM ' : 'AM '}
              </span>
              {startTime}
            </div>
            <span className={styled.wave}>~</span>
            <div>
              <span className={styled.twelve}>
                {parseInt(endTime, 10) >= 12 ? 'PM ' : 'AM '}
              </span>
              {endTime}
            </div>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span className={styled.icon}>
                <IconCalendar width={20} height={20} fill="#212223" />
              </span>
              매주 {lectureDayString}요일
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
              {lecture.lectureEndDate
                ? `${dayjs(lecture.lectureEndDate).format('YYYY년 MM월 DD일')} 종료`
                : '종료일 없이 반복'}
            </p>
          </div>

          <div className={styled.lecture_info}>
            <p>
              <span
                className={styled.color_box}
                style={{ backgroundColor: lecture.lectureColor }}></span>
              구분색
            </p>
          </div>
        </div>
      </div>

      <div className={styled.bottom_gap}></div>
    </div>
  );
}
