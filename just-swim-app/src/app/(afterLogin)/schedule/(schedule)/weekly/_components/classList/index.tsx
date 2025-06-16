'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ClassDetailItem } from '@components';
import { LectureProps } from '@types';
import { WEEK_DAYS } from '@data';
import { randomId } from '@utils';

import styled from './styles.module.scss';
import Link from 'next/link';

function _ClassList({
  weeklyInfo,
  selectedDate,
  userType,
}: {
  weeklyInfo: { date: string; day: string; lectures: LectureProps[] }[];
  selectedDate: number;
  userType: string;
}) {
  const todaySchedules = weeklyInfo[selectedDate].lectures;
  const todayDate = weeklyInfo[selectedDate].date.split('.')[2];

  return (
    <div className={styled.container}>
      {todaySchedules.length === 0 ? (
        <p className={styled.not_exist}>등록된 수업이 없습니다</p>
      ) : (
        <div className={styled.info}>
          <span>{todayDate},</span>
          <span
            className={`${styled.date} ${selectedDate === 6 && styled.blue} ${selectedDate === 0 && styled.red}`}>
            {WEEK_DAYS[selectedDate]}
          </span>
        </div>
      )}
      {todaySchedules.length !== 0 && (
        <div className={styled.list_container}>
          <div className={styled.list}>
            {todaySchedules.map((schedule) => {
              return (
                <Link
                  href={`/class/detail/${schedule.lectureId}`}
                  key={schedule.lectureId}>
                  <ClassDetailItem schedule={schedule} type={userType} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const ClassList = React.memo(_ClassList);
