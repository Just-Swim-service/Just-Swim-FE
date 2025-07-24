'use client';

import { BottomNav, Header } from '@components';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from './classView.module.scss';
import { IconRepeatTime, IconLocation, IconClock } from '@assets';
import { LectureViewProps } from '@types';
import React from 'react';
import { fetchJson } from '@utils';

const ClassList = React.memo(({ item }: { item: LectureViewProps }) => {
  return (
    <div
      key={item.lectureId}
      className={styled.tab_content}
      style={{ boxShadow: `0px -3px 0 0 ${item.lectureColor}` }}>
      <div className={styled.lectureItem}>
        <Link href={`/customer/class/detail/${item.lectureId}`}>
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
              <div className={styled.photo_list}>
                {item.members?.slice(-4).map((member, index) => (
                  <Image
                    key={index}
                    //  @ts-ignore
                    src={member.memberProfileImage}
                    alt="회원 프로필 사진"
                    width={28}
                    height={28}
                    style={{
                      borderRadius: '28px',
                      verticalAlign: 'middle',
                    }}
                    priority
                  />
                ))}
              </div>
              <p className={styled.count}>
                {item.members?.length ? `${item.members.length}명` : '0명'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

ClassList.displayName = 'ClassList';

export default function ClassView() {
  const [lectures, setLectures] = useState<LectureViewProps[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await fetchJson<{ data: LectureViewProps[] }>(
          '/lecture/schedule',
        );
        const processedLectures = data.data.map((lecture) => {
          const lectureEndDate = new Date(
            lecture.lectureEndDate.replace(/\./g, '-'),
          );
          const isPastLecture = lectureEndDate < new Date();
          return { ...lecture, isPastLecture };
        });
        setLectures(processedLectures);
      } catch (error) {
        console.error('수업 목록 불러오기 실패:', error);
      }
    };

    fetchLectures();
  }, []);

  const filteredLectures = (isPast: boolean) => {
    return lectures.filter(
      (lecture) =>
        lecture.isPastLecture === isPast &&
        (searchText === '' ||
          lecture.members?.some((member) =>
            member.name.toLowerCase().includes(searchText.toLowerCase()),
          )),
    );
  };

  const renderLectureList = (lectures: LectureViewProps[], isPast: boolean) => {
    return lectures.length ? (
      <>
        <div className="left_content">
          {lectures.map((item, index) =>
            index % 2 === 0 ? <ClassList key={index} item={item} /> : null,
          )}
        </div>
        <div className="right_content">
          {lectures.map((item, index) =>
            index % 2 !== 0 ? <ClassList key={index} item={item} /> : null,
          )}
        </div>
      </>
    ) : (
      <div className={styled.null}>
        <p>
          {isPast ? (
            '지난 수업 기록이 없습니다.'
          ) : (
            <>
              수강 중인 수업이 없습니다. <br /> 강사님께 QR코드를 요청해 보세요!
            </>
          )}
        </p>
      </div>
    );
  };

  return (
    <>
      <Header title="수업 정보" />

      <p className={styled.title}>진행 중인 수업</p>
      <div className={styled.tab_list}>
        {renderLectureList(filteredLectures(false), false)}
      </div>

      <div className={styled.bar}></div>

      <p className={styled.title}>지난 수업</p>
      <div className={styled.tab_list}>
        {renderLectureList(filteredLectures(true), true)}
      </div>

      <BottomNav />
    </>
  );
}
