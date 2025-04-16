'use client';

import styled from './styled.module.scss';

export function QRCodeHeader() {
  return (
    <header className={styled.header}>
      <div className={styled.title_wrapper}>
        <h1>수업 등록 완료</h1>
      </div>
    </header>
  );
}
