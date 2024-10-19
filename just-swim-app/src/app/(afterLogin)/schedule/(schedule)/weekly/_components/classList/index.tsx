'use client';

import React, { useRef } from 'react';

import { ClassDetailItem } from '@components';
import { LectureProps } from '@types';
import { WEEK_DAYS } from '@data';
import { randomId } from '@utils';
import { useUserStore } from '@store';

import styled from './styles.module.scss';

function _ClassList({
  weeklyInfo,
  selectedDate,
  token
}: {
  weeklyInfo: { date: string, day: string, lectures: LectureProps[] }[],
  selectedDate: number,
  token: string,
}) {
  const { getUserType } = useUserStore();

  const type = useRef<string>(getUserType(token));
  const todaySchedules = weeklyInfo[selectedDate].lectures;
  const todayDate = weeklyInfo[selectedDate].date.split('.')[2];

  return (
    <div className={styled.container}>
      {
        todaySchedules.length === 0
        ? 
        <p className={styled.not_exist}>등록된 수업이 없습니다</p>
        :
        <div className={styled.info}>
          <span>{todayDate},</span>
          <span className={`${styled.date} ${selectedDate === 6 && styled.blue} ${selectedDate === 0 && styled.red}`}>{WEEK_DAYS[selectedDate]}</span>
        </div>
      }
      {
        todaySchedules.length !== 0 &&
        <div className={styled.list_container}>
          <div className={styled.list}>
            {
              todaySchedules.map(schedule => {
                return (
                  <ClassDetailItem
                    key={randomId()}
                    schedule={schedule}
                    type={type.current}
                  />
                )
              })
            }
          </div>
        </div>
      }
    </div>
  )
}

export const ClassList = React.memo(_ClassList);