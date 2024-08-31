'use client';

import {
  TimeInput,
  Header,
  TextInput,
  DayInput,
  LocationInput,
  DateInput,
  ColorInput,
} from '@components';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from './classInfoEdit.module.scss';
import { getTokenInCookies } from '@utils';

export default function ClassInfoEdit() {
  const params = useParams();
  const router = useRouter();
  const authorizationToken = getTokenInCookies();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `Bearer ${authorizationToken}`;

  const [lecture, setLecture] = useState([]);
  const [formData, setFormData] = useState({});

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLecture(data.data);
      });
  }, [lectureId]);

  if (!lecture || lecture.length === 0) {
    return <p>로딩 중</p>;
  }

  const isFormDataChanged = (lectureData: object, formData: object) => {
    for (const key in formData) {
      //  @ts-ignore
      if (lectureData[key] !== formData[key]) {
        return true;
      }
    }
    return false;
  };

  const handleEdit = async (lectureId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_HOST}/lecture/${lectureId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: AUTHORIZATION_HEADER,
          },
          body: JSON.stringify(formData),
        },
      );
      const updatedLectureData = await response.json();
      console.log(updatedLectureData);
      setLecture(updatedLectureData);
      alert('수정되었습니다.');
      router.push(`/instructor/class/detail/${lectureId}`);
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* @ts-ignore */}
      <div key={lecture.id}>
        <Header title="수업 정보 수정" />
        <div className={styled.edit}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              //  @ts-ignore
              handleEdit(lecture.lectureId);
            }}>
            <div className={styled.inner}>
              <h3>
                수정된 정보는 수강생 분들에게도
                <br />
                적용되니 유의해주세요.
              </h3>
              <label htmlFor="lectureTitle">
                수업명
                <span>(필수)</span>
              </label>
              {/* @ts-ignore */}
              <TextInput
                name="lectureTitle"
                //  @ts-ignore
                defaultValue={lecture.lectureTitle}
                //  @ts-ignore
                value={formData.lectureTitle}
                onChange={handleChange}
              />
              <label htmlFor="lectureContent">
                수업 설명
                <span>(필수)</span>
              </label>
              {/* @ts-ignore */}
              <TextInput
                name="lectureContent"
                //  @ts-ignore
                defaultValue={lecture.lectureContent}
                //  @ts-ignore
                value={formData.lectureContent}
                onChange={handleChange}
              />
            </div>

            <div className={styled.line}></div>

            <div className={styled.inner}>
              <label htmlFor="lectureTime">
                수업 시간
                <span>(필수)</span>
              </label>
              {/* @ts-ignore */}
              <TimeInput
                name="lectureTime"
                //  @ts-ignore
                defaultValue={lecture.lectureTime}
                //  @ts-ignore
                defaultTimeValue={lecture.lectureTime}
                //  @ts-ignore
                value={formData.lectureTime}
                onChange={handleChange}
              />

              <label htmlFor="lectureDays">
                수업 요일
                <span>(필수)</span>
              </label>
              {/* @ts-ignore */}
              <DayInput
                name="lectureDays"
                //  @ts-ignore
                defaultValue={lecture.lectureDays}
                //  @ts-ignore
                value={formData.lectureDays}
              />

              <label htmlFor="lectureLocation">수업 위치</label>
              {/* @ts-ignore */}
              <LocationInput
                name="lectureLocation"
                // @ts-ignore
                defaultValue={lecture.lectureLocation}
                // @ts-ignore
                value={formData.lectureLocation}
              />

              <label htmlFor="lectureEndDate">종료 일자</label>
              <DateInput
                name="lectureEndDate"
                // @ts-ignore
                defaultValue={lecture.lectureEndDate}
                // @ts-ignore
                value={formData.lectureEndDate}
                onChange={handleChange}
              />

              <label htmlFor="lectureColor">구분 색</label>
              <ColorInput
                name="lectureColor"
                // @ts-ignore
                defaultValue={lecture.lectureColor}
                // @ts-ignore
                value={formData.lectureColor}
                onChange={handleChange}
              />
            </div>

            <button
              className={styled.edit_btn}
              type="submit"
              disabled={!isFormDataChanged(lecture, formData)}>
              수정하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
