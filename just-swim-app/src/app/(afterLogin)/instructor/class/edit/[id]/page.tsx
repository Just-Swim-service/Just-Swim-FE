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

export default function ClassInfoEdit() {
  const params = useParams();
  const router = useRouter();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

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
        if (data.data && data.data.lectureTime) {
          const lectureTime = data.data.lectureTime.split('-');
          setLecture({ ...data.data, lectureTime });
          console.log(data);
        } else {
          setLecture(data.data);
        }
      });
  }, [lectureId]);

  if (!lecture || lecture.length === 0) {
    return <p>로딩 중</p>;
  }

  const isFormDataChanged = (lectureData: object, formData: object) => {
    for (const key in formData) {
      if (lectureData[key] !== formData[key]) {
        return true;
      }
    }
    return false;
  };

  const handleEdit = async (lectureId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`,
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
      <div key={lecture.id}>
        <Header title="수업 정보 수정" />
        <div className={styled.edit}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
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
              <TextInput
                name="lectureTitle"
                value={formData.lectureTitle || lecture.lectureTitle}
                onChange={handleChange}
              />

              <label htmlFor="lectureContent">
                수업 설명
                <span>(필수)</span>
              </label>
              <TextInput
                name="lectureContent"
                value={formData.lectureContent || lecture.lectureContent}
                onChange={handleChange}
              />
            </div>

            <div className={styled.line}></div>

            <div className={styled.inner}>
              <label htmlFor="lectureTime">
                수업 시간
                <span>(필수)</span>
              </label>
              <TimeInput
                name="lectureTime"
                defaultValue={formData.lectureTime || lecture.lectureTime}
                defaultTimeValue={lecture.lectureTime}
                onChange={handleChange}
              />

              <label htmlFor="lectureDays">
                수업 요일
                <span>(필수)</span>
              </label>
              <DayInput
                name="lectureDays"
                defaultValue={formData.lectureDays || lecture.lectureDays}
              />

              <label htmlFor="lectureLocation">수업 위치</label>
              <TextInput
                name="lectureLocation"
                value={formData.lectureLocation || lecture.lectureLocation}
                onChange={handleChange}
              />
              {/* 수정 완료되면 추가 */}
              {/* <LocationInput
                  name="lectureLocation"
                  defaultValue={lecture.lectureLocation}
                /> */}

              <label htmlFor="lectureEndDate">종료 일자</label>
              <DateInput
                name="lectureEndDate"
                defaultValue={formData.lectureEndDate || lecture.lectureEndDate}
                onChange={handleChange}
              />

              <label htmlFor="lectureColor">구분 색</label>
              <ColorInput
                name="lectureColor"
                defaultValue={formData.lectureColor || lecture.lectureColor}
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
