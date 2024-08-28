'use client';

import { Dispatch, SetStateAction, useTransition } from "react";

import { getToday, getWeekNumber, randomId } from "@utils";
import { LectureProps } from "@types";

import styled from './styles.module.scss';

export function WeekInfo({
  weeklyInfo,
  selectedDate,
  setSelectedDate,
}: {
  weeklyInfo: { date: string, day: string, lectures: LectureProps[] }[],
  selectedDate: number,
  setSelectedDate: Dispatch<SetStateAction<number>>,
}) {
  const [_, startTransition] = useTransition();

  const today = getToday();
  const day = today.getDay();

  const onClickButton = (index: number) => {
    startTransition(() => {
      setSelectedDate(index);
    });
  }

  return (
    <div className={styled.container}>
      <p className={styled.weekInfo}>{`${today.getMonth() + 1}월 ${getWeekNumber(getToday())}주차`}</p>
      <div className={styled.list}>
        {
          weeklyInfo.map((date, idx) => {
            const todaySchedules = date.lectures;

            return (
              <div key={randomId()} className={styled.item_wrapper}>
                <button className={`${styled.item} ${idx < day && styled.deactive} ${selectedDate === idx && styled.selected}`} disabled={idx < day} onClick={() => {onClickButton(idx)}}>
                  <span>{date.day}</span>
                  <span>{date.date.split('.')[2]}</span>
                </button>
                <div className={styled.count}>
                  {
                    todaySchedules.map((schedule, index) => {
                      if (index >= 5) {
                        return null;
                      }

                      return (
                        <div
                          key={randomId()}
                          className={styled.dot}
                          style={{
                            backgroundColor: idx < day ? '' : schedule.lectureColor 
                          }}
                        />
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}