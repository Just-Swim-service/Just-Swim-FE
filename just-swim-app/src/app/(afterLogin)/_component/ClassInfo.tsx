'use client';

import Timepicker from '../../_component/TimePicker';
import Datepicker from '../../_component/DatePicker';
import './classInfo.scss';
import { useState } from 'react';
import ColorModal from '../../_component/Modal/ColorModal';

interface Props {
  islabel: boolean;
  bgColor?: 'gray' | 'white';
}

export default function ClassInfo({ islabel, bgColor }: Props) {
  const [showModal, setShowModal] = useState(false);
  // const clickModal = () => setShowModal(!showModal);
  const clickModal = () => setShowModal(!showModal);

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
        onClick={clickModal}
        className={`input ${bgColor == 'gray' ? 'gray' : 'white'}`}
        placeholder={bgColor}></input>
      {showModal && <ColorModal clickModal={clickModal} />}
    </div>
  );
}
