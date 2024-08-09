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
import { useParams } from 'next/navigation';
import styled from './classInfoEdit.module.scss';

export default function ClassInfoEdit() {
  const params = useParams();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

  const [lecture, setLecture] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (lectureId: any) => {
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

      if (!response.ok) {
        throw new Error(
          `API error: ${response.status} - ${await response.text()}`,
        );
      }

      // 성공 시 서버에서 반환받은 데이터로 업데이트
      const updatedLectureData = await response.json();
      console.log(updatedLectureData);
      setLecture(updatedLectureData); // 수정된 데이터로 업데이트
      alert('수정되었습니다.');
    } catch (error) {
      console.error('API error:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

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
        console.log(data.data);
        setLecture(data.data);
      })
      .catch((error) => {
        console.error('API error:', error);
        setError(error);
      });
  }, []);

  if (error) {
    console.error('API error:', error);
    return <p>API 오류 발생</p>;
  }

  if (!lecture || lecture.length === 0) {
    return <p>데이터 로딩 중...</p>;
  }

  const isFormDataChanged = (lectureData: any, formData: any) => {
    for (const key in formData) {
      if (lectureData[key] !== formData[key]) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      {lecture && lecture.length > 0 ? (
        lecture.map((item) => (
          <div key={item.id}>
            <Header title="수업 정보 수정" />

            <div className={styled.edit}>
              {lecture.map((item) => (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(item.lectureId);
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
                        value={formData.lectureTitle || item.lectureTitle}
                        onChange={handleChange}
                      />

                      <label htmlFor="lectureContent">
                        수업 설명
                        <span>(필수)</span>
                      </label>
                      <TextInput
                        name="lectureContent"
                        value={formData.lectureContent || item.lectureContent}
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
                        defaultValue={formData.lectureTime || item.lectureTime}
                        defaultTimeValue={item.lectureTime}
                        onChange={handleChange}
                      />

                      <label htmlFor="lectureDays">
                        수업 요일
                        <span>(필수)</span>
                      </label>
                      <DayInput
                        name="lectureDays"
                        defaultValue={formData.lectureDays || item.lectureDays}
                      />

                      <label htmlFor="lectureLocation">수업 위치</label>
                      <TextInput
                        name="lectureLocation"
                        value={formData.lectureLocation || item.lectureLocation}
                        onChange={handleChange}
                      />
                      {/* 수정 완료되면 추가 */}
                      {/* <LocationInput
                  name="lectureLocation"
                  defaultValue={item.lectureLocation}
                /> */}

                      <label htmlFor="lectureEndDate">종료 일자</label>
                      <DateInput
                        name="lectureEndDate"
                        defaultValue={
                          formData.lectureEndDate || item.lectureEndDate
                        }
                        onChange={handleChange}
                      />

                      <label htmlFor="lectureColor">구분 색</label>
                      <ColorInput
                        name="lectureColor"
                        defaultValue={formData.lectureColor || item.lectureColor}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      className={styled.edit_btn}
                      type="submit"
                      disabled={!isFormDataChanged(item, formData)}>
                      수정하기
                    </button>
                  </form>
                </>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
}
