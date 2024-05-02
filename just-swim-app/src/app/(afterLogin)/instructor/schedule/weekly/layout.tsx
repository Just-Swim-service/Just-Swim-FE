'use client';

import React, { useState } from 'react';
import './weekly.scss';

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
      <div className="week_button_wrapper">
        <div className="week_buttons">
          <div className="week_number">5월 1주차</div>
          <div className="week_button">
            {/* 요일 버튼 */}
            {[
              { day: '월', date: '1' },
              { day: '화', date: '2' },
              { day: '수', date: '3' },
              { day: '목', date: '4' },
              { day: '금', date: '5' },
              { day: '토', date: '6' },
              { day: '일', date: '7' },
            ].map((item) => (
              <button key={item.date} onClick={() => handleDayClick(item)}>
                <div className="button_day">{item.day}</div>
                <div className="button_date">{item.date}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="week_contents">{children}</div>
      </div>
      {/* {modal} */}
      {/* <div className="schedule_wrapper">
          {Object.entries(schedule).map(([day, daySchedule]) => (
            <div key={day} className="day_schedule">
              {daySchedule.map(({ time, plan }) => (
                <div key={time} className="schedule_item">
                  <div className="time">{time}</div>
                  <div className="plan">{plan}</div>
                </div>
              ))}
            </div>
          ))}
        </div> */}
    </>
  );
}
