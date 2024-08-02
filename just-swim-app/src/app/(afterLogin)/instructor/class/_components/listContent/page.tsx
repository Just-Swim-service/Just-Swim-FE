'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from './listContent.module.scss';
import { IconRepeatTime, IconLocation, IconClock } from '@assets';

export default function ListContent() {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/myLectures`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_DB_TOKEN}`;

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
        setLectures(data.data);
      })
      .catch((error) => {
        setError(error);
        console.error('API error:', error);
      });
  }, []);

  const classList = lectures.map((item) => ({
    lectureId: item.lectureId,
    title: item.lectureTitle,
    content: item.lectureContent,
    location: item.lectureLocation,
    days: item.lectureDays,
    time: item.lectureTime,
    color: item.lectureColor,
  }));

  if (error) {
    console.error('API error:', error);
    return <p>API 오류 발생</p>;
  }

  if (!lectures || lectures.length === 0) {
    return <p>데이터 로딩 중...</p>;
  }

  return (
    <>
      <p className={styled.title}>진행 중인 수업</p>
      <div className={styled.tab_list}>
        {classList.map((item) => (
          <div
            key={item.title}
            className={styled.tab_content}
            style={{ boxShadow: `0px -3px 0 0 ${item.color}` }}>
            <Link href={`/instructor/class/detail/${item.lectureId}`}>
              <div className={styled.text_content}>
                <p className={styled.name}>{item.title}</p>
                <p className={styled.target}>{item.content}</p>
                <div className={styled.info}>
                  <p>
                    <span className={styled.icon}>
                      <IconLocation />
                    </span>
                    {item.location}
                  </p>
                  <p>
                    <span className={styled.icon}>
                      <IconClock />
                    </span>
                    {item.days}
                  </p>
                  <p>
                    <span className={styled.icon}>
                      <IconRepeatTime />
                    </span>
                    {item.time}
                  </p>
                </div>
                <div className={styled.profile_box}>
                  <p>15명</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className={styled.bar}></div>
      <p className={styled.title}>지난 수업</p>
      <div className={styled.tab_list}></div>
    </>
  );
}
