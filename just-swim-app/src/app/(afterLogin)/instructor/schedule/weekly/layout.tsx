'use client';

import React, { useState } from 'react';

import styled from './weekly.module.scss';

export default function Weekly({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const dummySchedule = [
    { day: '월', date: '1', classCnt: 3 },
    { day: '화', date: '2', classCnt: 1 },
    { day: '수', date: '3', classCnt: 4 },
    { day: '목', date: '4', classCnt: 2 },
    { day: '금', date: '5', classCnt: 3 },
    { day: '토', date: '6', classCnt: 1 },
    { day: '일', date: '7', classCnt: 2 },
  ];

  const handleDayClick = (item: any) => {
    const dummySchedule = Array.from({ length: 12 }, (_, index) => ({
      time: `${index + 6}:00`,
      plan: `Plan for ${item.day} at ${index + 6}:00`,
    }));
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [item.day]: dummySchedule,
    }));
  };

  return (
    <>
      <div className={styled.week_button_wrapper}>
        <div className={styled.week_buttons}>
          <div className={styled.week_number}>5월 1주차</div>
          <div className={styled.week_button}>
            {/* 요일 버튼 */}
            {dummySchedule.map((item) => (
              <div className={styled.week_button_info} key={item.date}>
                <button onClick={() => handleDayClick(item)}>
                  <div className={styled.button_day}>{item.day}</div>
                  <div className={styled.button_date}>{item.date}</div>
                </button>
                {/* 개수 조정 가능해야함 */}
                <div className={styled.class_count}>
                  {Array.from(
                    { length: Math.min(item.classCnt, 3) },
                    (_, index) => (
                      // 색 바꾸기 위해서 수업 정보 있어야함
                      <div key={index} className={styled.class_count_item}></div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styled.week_contents}>{children}</div>
      </div>
    </>
  );
}
