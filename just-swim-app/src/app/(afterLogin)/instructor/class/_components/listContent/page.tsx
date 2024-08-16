'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from './listContent.module.scss';
import { IconRepeatTime, IconLocation, IconClock } from '@assets';

export default function ListContent() {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_DB_HOST}/api/lecture/schedule`;
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
        const processedLectures = data.data.map(
          (lecture: { lectureEndDate: string }) => {
            const lectureEndDate = new Date(
              lecture.lectureEndDate.replace(/\./g, '-'),
            ); // Replace dots with dashes for Date object parsing
            const isPastLecture = lectureEndDate < new Date(); // Compare with current date

            return {
              ...lecture,
              isPastLecture,
            };
          },
        );
        setLectures(processedLectures);
      })
      .catch((error) => {
        setError(error);
        console.error('API error:', error);
      });
  }, []);

  if (error) {
    console.error('API error:', error);
    return <p>API 오류 발생</p>;
  }

  if (!lectures || lectures.length === 0) {
    return <p>데이터 로딩 중...</p>;
  }

  const ongoingLectures = lectures.filter((lecture) => !lecture.isPastLecture);
  const pastLectures = lectures.filter((lecture) => lecture.isPastLecture);

  return (
    <>
      <p className={styled.title}>진행 중인 수업</p>
      <div className={styled.tab_list}>
        <div className="left_content">
          {ongoingLectures.map((item, index) => (
            <>
              {index % 2 === 0 && (
                <div
                  key={item.lectureId}
                  className={styled.tab_content}
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        <p className={styled.name}>{item.lectureTitle}</p>
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <p className={styled.count}>
                            {item.memberUserId &&
                            typeof item.memberUserId === 'number'
                              ? `${item.memberUserId}명`
                              : '0명'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        <div className="right_content">
          {ongoingLectures.map((item, index) => (
            <>
              {index % 2 !== 0 && (
                <div
                  key={item.lectureId}
                  className={styled.tab_content}
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        <p className={styled.name}>{item.lectureTitle}</p>
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <p className={styled.count}>
                            {item.memberUserId &&
                            typeof item.memberUserId === 'number'
                              ? `${item.memberUserId}명`
                              : '0명'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      <div className={styled.bar}></div>

      <p className={styled.title}>지난 수업</p>

      <div className={styled.tab_list}>
        <div className="left_content">
          {pastLectures.map((item, index) => (
            <>
              {index % 2 === 0 && (
                <div
                  key={item.lectureId}
                  className={styled.tab_content}
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        <p className={styled.name}>{item.lectureTitle}</p>
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <p className={styled.count}>
                            {item.memberUserId &&
                            typeof item.memberUserId === 'number'
                              ? `${item.memberUserId}명`
                              : '0명'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        <div className="right_content">
          {pastLectures.map((item, index) => (
            <>
              {index % 2 !== 0 && (
                <div
                  key={item.lectureId}
                  className={styled.tab_content}
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        <p className={styled.name}>{item.lectureTitle}</p>
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <p className={styled.count}>
                            {item.memberUserId &&
                            typeof item.memberUserId === 'number'
                              ? `${item.memberUserId}명`
                              : '0명'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
}
