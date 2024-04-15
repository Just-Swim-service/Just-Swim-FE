'use client';

import { ReactNode } from 'react';
import Timepicker from './TimePicker';
import './classInfo.scss';
import Datepicker from './DatePicker';

export default function ClassInfo() {
  return (
    <div className="classInfo">
      <div className="classInfo_time">
        <Timepicker label="시작" />
        ~
        <Timepicker label="끝" />
      </div>
      {/* hyebin 매주 요일 지정 구현하기 */}
      <div className="bg_white">
        <Datepicker />
      </div>
      <input className="input" placeholder="강동구 실내 수영장" />
      <div className="bg_white">
        <Datepicker />
      </div>
      <input className="input" placeholder="color picker" />
    </div>
  );
}
