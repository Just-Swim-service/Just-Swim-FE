'use client';

import { BottomNav, Header } from '@components';

import { ChangeEvent, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import styled from './classView.module.scss';

import { IconRepeatTime, IconLocation, IconClock, IconSearch } from '@assets';
import NoProfile from '@/_assets/images/no_profile.png';
import { LectureViewProps } from '@types';

import React from 'react';
import { getMyProfile } from '@apis';
import { fetchJson } from '@utils';

const ClassList = React.memo(
  ({
    item,
    index,
    type,
  }: {
    item: LectureViewProps;
    index: number;
    type: string;
  }) => {
    return (
      <div
        key={item.lectureId}
        className={styled.tab_content}
        style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
        <div className={styled.lectureItem}>
          <Link href={`/class/detail/${item.lectureId}`}>
            <div className={styled.text_content}>
              <p className={styled.name}>{item.lectureTitle}</p>
              <p className={styled.target}>{item.lectureContent}</p>
              <div className={styled.info}>
                <p>
                  <span className={styled.icon}>
                    <IconLocation width="18" height="18" fill="#5C5E62" />
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
                    <IconRepeatTime width="18" height="18" fill="#5C5E62" />
                  </span>
                  {item.lectureTime}
                </p>
              </div>
              <div className={styled.profile_box}>
                {type === 'instructor' ? (
                  <div>
                    <div className={styled.photo_list}>
                      {item.members && item.members.length > 0 && (
                        <>
                          {item.members.slice(-4).map((member, index) => (
                            <Image
                              key={index}
                              // @ts-ignore
                              src={member.profileImage || NoProfile}
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
                ) : (
                  <div className={styled.instructor_info}>
                    <div className={styled.photo_list}>
                      <Image
                        // @ts-ignore
                        src={item.instructorProfileImage || NoProfile}
                        alt={`${item.instructor.instructorName} 강사`}
                        width={28}
                        height={28}
                        style={{
                          borderRadius: '28px',
                          verticalAlign: 'middle',
                        }}
                      />
                    </div>
                    <div className={styled.instructor_name}>
                      <p>{item.instructor.instructorName} 강사</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  },
);

ClassList.displayName = 'ClassList';

export default function ClassView() {
  const [lectures, setLectures] = useState<LectureViewProps[]>([]);
  const [searchText, setSearchText] = useState('');

  const [type, setType] = useState<string>('');

  useEffect(() => {
    const setUserType = async () => {
      const data = await getMyProfile();
      setType(data.data.data.userType);
    };
    setUserType();
  }, []);

  useEffect(() => {
    fetchJson<{ data: LectureViewProps[] }>('/lecture/schedule').then((data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processedLectures =
        data.data?.map((lecture) => {
          const parsedDateStr = lecture.lectureEndDate.replace(/\./g, '-');
          const lectureEndDate = new Date(parsedDateStr);
          lectureEndDate.setHours(0, 0, 0, 0);

          return {
            ...lecture,
            isPastLecture: lectureEndDate < today,
          };
        }) ?? [];
      setLectures(processedLectures);
    });
  }, []);

  const ongoingLectures = useMemo(() => {
    return (
      lectures &&
      lectures.filter(
        (lecture) =>
          !lecture.isPastLecture &&
          (searchText === '' ||
            lecture.members?.some((member) =>
              member.name.toLowerCase().includes(searchText.toLowerCase()),
            )),
      )
    );
  }, [lectures, searchText]);

  const pastLectures = useMemo(() => {
    return (lectures || []).filter(
      (lecture) =>
        lecture.isPastLecture &&
        (searchText === '' ||
          lecture.members?.some((member) =>
            member.name.toLowerCase().includes(searchText.toLowerCase()),
          )),
    );
  }, [lectures, searchText]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <Header title="수업 정보" />
      <div className={styled.container}>
        {type === 'instructor' && (
          <div className={styled.search}>
            <IconSearch className={styled.search_icon} />
            <input
              type="text"
              placeholder="수강생 검색하기"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
        )}
        {type && (
          <>
            <p className={styled.title}>진행 중인 수업</p>
            <div className={styled.tab_list}>
              {ongoingLectures.length > 0 ? (
                ongoingLectures.map((item, index) => (
                  <ClassList
                    key={item.lectureId}
                    item={item}
                    index={index}
                    type={type}
                  />
                ))
              ) : (
                <p className={styled.empty_text}>
                  수강 중인 수업이 없습니다.
                  <br />
                  강사님께 QR코드를 요청해 보세요!
                </p>
              )}
            </div>

            <div className={styled.bar}></div>

            <p className={styled.title}>지난 수업</p>
            <div className={styled.tab_list}>
              {pastLectures.length > 0 ? (
                pastLectures.map((item, index) => (
                  <ClassList
                    key={item.lectureId}
                    item={item}
                    index={index}
                    type={type}
                  />
                ))
              ) : (
                <p className={styled.empty_text}>지난 수업 기록이 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}
