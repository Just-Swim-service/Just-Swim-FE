'use client';

import {
  TimepickerPrev,
  Header,
  DatepickerPrev,
  RepeatDatepicker,
  TextInput,
} from '@components';

import {
  IconArrowRight,
  IconTrashcan,
  IconClock,
  IconCalendar,
  IconLocation,
  IconRepeat,
  IconShare,
  IconDownload,
} from '@assets';

import { useEffect, useState } from 'react';
import location_icon from '/public/assets/input_icon_location.png';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styled from './classInfoEdit.module.scss';

export default function ClassInfoEdit() {
  const params = useParams();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

  const [lecture, setLecture] = useState([]);
  const [error, setError] = useState(null);

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
    lectureDays: item.lectureDays.replace(/./g, '$& ').trim(),
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

  const router = useRouter();

  return (
    <div>
      <Header title="수업 정보 수정" />

      <div className={styled.edit}>
        {lectureData.map((item) => (
          <>
            <form>
              <div className={styled.inner}>
                <h3>
                  수정된 정보는 수강생 분들에게도
                  <br />
                  적용되니 유의해주세요.
                </h3>
                <div className={styled.class_info1}>
                  <label htmlFor="lectureTitle">
                    수업명<span>(필수)</span>
                  </label>
                  <TextInput
                    id="lectureTitle"
                    name="lectureTitle"
                    value={item.lectureTitle}
                  />

                  <label htmlFor="lectureContent">
                    수업 설명<span>(필수)</span>
                  </label>
                  <TextInput
                    id="lectureContent"
                    name="lectureContent"
                    value={item.lectureContent}
                  />
                </div>
              </div>

              <div className={styled.line}></div>

              <div className={styled.inner}>
                <div className={styled.classInfo}>
                  <label htmlFor="">
                    수업 시간
                    <span>(필수)</span>
                  </label>
                  <div className={styled.classInfo_time}>
                    <TimepickerPrev label="시작" bgColor="gray" />
                    ~
                    <TimepickerPrev label="끝" bgColor="gray" />
                  </div>

                  <label>
                    수업 요일
                    <span>(필수)</span>
                  </label>
                  <DatepickerPrev bgColor="gray" />

                  <div className={styled.location_input}>
                    <label htmlFor="location">수업 위치</label>
                    <input
                      id="location"
                      className={`${styled.input} ${styled.gray}`}
                      placeholder="강동구 실내 수영장"
                      onClick={() => router.push('edit/search')}
                    />
                  </div>

                  <label>종료 일자</label>
                  <label>구분 색</label>
                  <div className={styled.color_input}>
                    <input
                      className={`${styled.input} ${styled.gray}`}
                      placeholder="구분색"></input>
                    <div className={styled.pick_color} />
                  </div>
                </div>
              </div>
              <button className={styled.edit_btn}>수정하기</button>
            </form>
          </>
        ))}
      </div>
    </div>
  );
}
