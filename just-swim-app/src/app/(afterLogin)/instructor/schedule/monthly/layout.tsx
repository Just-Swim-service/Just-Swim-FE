'use client';

import './monthly.scss';
import Calendar from 'react-calendar';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [value, setValue] = useState<Value>(new Date());
  console.log('value', value);

  return (
    <>
      <div className="month_wrapper">
        <Calendar locale="ko" onChange={setValue} value={value}/>
      </div>
      {/* {children} */}
    </>
  );
}
