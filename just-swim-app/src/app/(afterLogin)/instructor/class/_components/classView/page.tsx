'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styled from './classView.module.scss';

import { IconRepeatTime, IconLocation, IconClock } from '@assets';
import { LectureViewProps } from '@types';

export default function ClassView() {
  const [lectures, setLectures] = useState<LectureViewProps[]>([]);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/schedule`;
  const AUTHORIZATION_HEADER = `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`;

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
  }, [API_URL, AUTHORIZATION_HEADER]);

  const ongoingLectures = lectures.filter((lecture) => !lecture.isPastLecture);
  const pastLectures = lectures.filter((lecture) => lecture.isPastLecture);

  return (
    <>
      <p className={styled.title}>진행 중인 수업</p>
      <div className={styled.tab_list}>
        <div className="left_content">
          {ongoingLectures.map((item: LectureViewProps, index) => (
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
                              <IconLocation
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock width="18" height="18" fill="#5C5E62" />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {item.members && item.members.length > 0 && (
                              <>
                                {item.members.slice(-4).map((member, index) => (
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
                            {item.members && item.members.length > 0
                              ? `${item.members.length}명`
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
          {ongoingLectures.map((item: LectureViewProps, index) => (
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
                              <IconLocation
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock width="18" height="18" fill="#5C5E62" />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {item.members && item.members.length > 0 && (
                              <>
                                {item.members.slice(-4).map((member, index) => (
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
                            {item.members && item.members.length > 0
                              ? `${item.members.length}명`
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
          {pastLectures.map((item: LectureViewProps, index) => (
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
                              <IconLocation
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock width="18" height="18" fill="#5C5E62" />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {item.members && item.members.length > 0 && (
                              <>
                                {item.members.slice(-4).map((member, index) => (
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
                            {item.members && item.members.length > 0
                              ? `${item.members.length}명`
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
          {pastLectures.map((item: LectureViewProps, index) => (
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
                              <IconLocation
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureLocation}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconClock width="18" height="18" fill="#5C5E62" />
                            </span>
                            {item.lectureDays}
                          </p>
                          <p>
                            <span className={styled.icon}>
                              <IconRepeatTime
                                width="18"
                                height="18"
                                fill="#5C5E62"
                              />
                            </span>
                            {item.lectureTime}
                          </p>
                        </div>
                        <div className={styled.profile_box}>
                          <div className={styled.photo_list}>
                            {item.members && item.members.length > 0 && (
                              <>
                                {item.members.slice(-4).map((member, index) => (
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
                            {item.members && item.members.length > 0
                              ? `${item.members.length}명`
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
