'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from './classView.module.scss';
import { IconRepeatTime, IconLocation, IconClock } from '@assets';
import Image from 'next/image';

export default function ClassView() {
  const [lectures, setLectures] = useState([]);

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
        return response.json();
      })
      .then((data) => {
        const processedLectures = data.data.map(
          (lecture: { lectureEndDate: string }) => {
            const lectureEndDate = new Date(
              lecture.lectureEndDate.replace(/\./g, '-'),
            );
            const isPastLecture = lectureEndDate < new Date();

            return {
              ...lecture,
              isPastLecture,
            };
          },
        );
        setLectures(processedLectures);
      });
  }, []);

  if (!lectures || lectures.length === 0) {
    return <p>데이터 로딩 중입니다.</p>;
  }

  // @ts-ignore
  const ongoingLectures = lectures.filter((lecture) => !lecture.isPastLecture);
  // @ts-ignore
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
                  // @ts-ignore
                  key={item.lectureId}
                  className={styled.tab_content}
                  // @ts-ignore
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    {/* @ts-ignore */}
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        {/* @ts-ignore */}
                        <p className={styled.name}>{item.lectureTitle}</p>
                        {/* @ts-ignore */}
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation
                                width="18"
                                height="18"
                                color={'red'}
                              />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0 && (
                              <>
                                {/* @ts-ignore */}
                                {item.members.map((member, index) => (
                                  <Image
                                    key={index}
                                    src={member.memberProfileImage}
                                    alt="회원 프로필 사진"
                                    width={28}
                                    height={28}
                                    style={{
                                      borderRadius: '28px',
                                      verticalAlign: 'middle',
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </div>
                          <p className={styled.count}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0
                              ? // @ts-ignore
                                `${item.members.length}명`
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
                  // @ts-ignore
                  key={item.lectureId}
                  className={styled.tab_content}
                  // @ts-ignore
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    {/* @ts-ignore */}
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        {/* @ts-ignore */}
                        <p className={styled.name}>{item.lectureTitle}</p>
                        {/* @ts-ignore */}
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0 && (
                              <>
                                {/* @ts-ignore */}
                                {item.members.map((member, index) => (
                                  <Image
                                    key={index}
                                    src={member.memberProfileImage}
                                    alt="회원 프로필 사진"
                                    width={28}
                                    height={28}
                                    style={{
                                      borderRadius: '28px',
                                      verticalAlign: 'middle',
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </div>
                          <p className={styled.count}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0
                              ? // @ts-ignore
                                `${item.members.length}명`
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
                  // @ts-ignore
                  key={item.lectureId}
                  className={styled.tab_content}
                  // @ts-ignore
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    {/* @ts-ignore */}
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        {/* @ts-ignore */}
                        <p className={styled.name}>{item.lectureTitle}</p>
                        {/* @ts-ignore */}
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0 && (
                              <>
                                {/* @ts-ignore */}
                                {item.members.map((member, index) => (
                                  <Image
                                    key={index}
                                    src={member.memberProfileImage}
                                    alt="회원 프로필 사진"
                                    width={28}
                                    height={28}
                                    style={{
                                      borderRadius: '28px',
                                      verticalAlign: 'middle',
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </div>
                          <p className={styled.count}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0
                              ? // @ts-ignore
                                `${item.members.length}명`
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
                  // @ts-ignore
                  key={item.lectureId}
                  className={styled.tab_content}
                  // @ts-ignore
                  style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
                  <div className={styled.lectureItem}>
                    {/* @ts-ignore */}
                    <Link href={`/instructor/class/detail/${item.lectureId}`}>
                      <div className={styled.text_content}>
                        {/* @ts-ignore */}
                        <p className={styled.name}>{item.lectureTitle}</p>
                        {/* @ts-ignore */}
                        <p className={styled.target}>{item.lectureContent}</p>
                        <div className={styled.info}>
                          <p>
                            <span className={styled.icon}>
                              <IconLocation />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime />
                            </span>
                            {/* @ts-ignore */}
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0 && (
                              <>
                                {/* @ts-ignore */}
                                {item.members.map((member, index) => (
                                  <Image
                                    key={index}
                                    src={member.memberProfileImage}
                                    alt="회원 프로필 사진"
                                    width={28}
                                    height={28}
                                    style={{
                                      borderRadius: '28px',
                                      verticalAlign: 'middle',
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          </div>
                          <p className={styled.count}>
                            {/* @ts-ignore */}
                            {item.members && item.members.length > 0
                              ? //   @ts-ignore
                                `${item.members.length}명`
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
