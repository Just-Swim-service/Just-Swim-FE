'use client';

import { ReactNode } from 'react';
import Timepicker from './TimePicker';
import './classInfo.scss';
import Datepicker from './DatePicker';

interface Props {
  islabel: boolean;
  bgColor?: 'gray' | 'white';
}

export default function ClassInfo({ islabel, bgColor }: Props) {
  return (
    <div className="classInfo">
      {islabel ? <label>수업시간</label> : null}
      <div className="classInfo_time">
        <Timepicker label="시작" bgColor={bgColor} />
        ~
        <Timepicker label="끝" bgColor={bgColor} />
      </div>
      {/* hyebin 매주 요일 지정 구현하기 */}

      {islabel ? <label>수업 요일</label> : null}
      <Datepicker bgColor={bgColor} />

      {islabel ? <label>수업 위치</label> : null}
      <input
        className={`input ${bgColor == 'gray' ? 'gray' : 'white'}`}
        placeholder="강동구 실내 수영장"
      />

      {islabel ? <label>종료 일자</label> : null}
      <Datepicker bgColor={bgColor} />

      {islabel ? <label>구분 색</label> : null}
      <input
        className={`input ${bgColor == 'gray' ? 'gray' : 'white'}`}
        placeholder="color picker"
      />
    </div>
  );
}
