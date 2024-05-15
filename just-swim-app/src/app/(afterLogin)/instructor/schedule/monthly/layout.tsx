'use client';

import './monthly.scss';
import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const month = date.getMonth();

  const handleDateChange = (date: Date) => {
    setDate(date);
  };
  const week = ['월', '화', '수', '목', '금', '토', '일'];

  const dayList = [
    '2024-05-10',
    '2024-05-21',
    '2024-05-05',
    '2024-05-23',
    '2024-05-27',
  ];

  // 각 날짜 타일에 컨텐츠 추가
  const addContent = ({ date }: any) => {
    // 해당 날짜(하루)에 추가할 컨텐츠의 배열
    const contents = [];

    // date(각 날짜)가 리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘) 추가

    if (
      dayList &&
      dayList?.find((day) => day === dayjs(date).format('YYYY-MM-DD'))
    ) {
      // if (dayList.find((day) => day === dayjs(date).format('YYYY-MM-DD'))) {
      contents.push(
        <>
          <div className="calender_content"></div>
        </>,
      );
    }
    return <div>{contents}</div>; // 각 날짜마다 해당 요소가 들어감
  };

  return (
    <>
      <div className="month_wrapper">
        <div className="month_and_week">
          <div className="month">
            {month + 1}월 <span>{'>'}</span>
          </div>
          <div className="week_wrapper">
            {week.map((day) => (
              // `type_button ${type === 'weekly' ? 'active' : ''}`
              <div
                className={`week ${day === '토' ? 'blue' : ''} ${day === '일' ? 'red' : ''}`}
                key={day}>
                {day}
              </div>
            ))}
          </div>
        </div>
        <Calendar
          locale="ko"
          formatDay={(_, date) => dayjs(date).format('D')}
          tileContent={addContent}
        />
      </div>
      {/* {children} */}
    </>
  );
}
