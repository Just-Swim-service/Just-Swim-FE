'use client';

import { useState } from 'react';

import styled from './classInfo.module.scss';

import { Datepicker, Timepicker, ColorModal } from '@components';

interface Props {
  islabel: boolean;
  bgColor?: 'gray' | 'white';
}

export function ClassInfo({ islabel, bgColor }: Props) {
  const [showModal, setShowModal] = useState(false);
  // const clickModal = () => setShowModal(!showModal);
  const clickModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className={styled.classInfo}>
      {islabel ? <label>수업시간</label> : null}
      <div className={styled.classInfo_time}>
        <Timepicker label="시작" bgColor={bgColor} />
        ~
        <Timepicker label="끝" bgColor={bgColor} />
      </div>
      {/* hyebin 매주 요일 지정 구현하기 */}

      {islabel ? <label>수업 요일</label> : null}
      <Datepicker bgColor={bgColor} />

      {islabel ? <label>수업 위치</label> : null}
      <input
        className={`${styled.input} ${bgColor === 'gray' ? styled.gray : styled.white}`}
        // className={`input ${bgColor == 'gray' ? 'gray' : 'white'}`}
        placeholder="강동구 실내 수영장"
      />

      {islabel ? <label>종료 일자</label> : null}
      <Datepicker bgColor={bgColor} />

      {islabel ? <label>구분 색</label> : null}
      <input
        onClick={clickModal}
        className={`${styled.input} ${bgColor === 'gray' ? styled.gray : styled.white}`}
        placeholder={bgColor}></input>
      {showModal && (
        <ColorModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
}
