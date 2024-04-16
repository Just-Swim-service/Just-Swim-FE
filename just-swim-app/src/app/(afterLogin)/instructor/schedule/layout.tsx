'use client';

import { useState } from 'react';
import styles from './Common.module.css';

import Weekly from '/public/assets/weekly.svg';
import Monthly from '/public/assets/monthly.svg';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState('weekly');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.topNavBarWrapper}>
          <div>페이지 위치</div>
          <button>
            <div>사진</div>
          </button>
        </div>
        <div className={styles.todayInfo}>
          {/* 날짜로 데이터 바꿔줘야함 */}
          <p>13일 토요일, 오늘</p>
          <h3>이후 등록된 수업이 없습니다.</h3>
          {/* <div>예정된 수업이 2개 있습니다.</div> */}
        </div>
        <div className={styles.scheduleViewTypeTab}>
          <div className={styles.TypeButtonWrapper}>
            <button
              className={`${styles.TypeButton} ${type === 'weekly' ? styles.isActive : ''}`}
              onClick={() => setType('weekly')}>
              <div className={styles.TypeButtonImg}>
                <div></div>
              </div>
              <div className={styles.TypeButtonInfo}>
                <div>
                  {/* TODO: Path 에 접근해서 색 조정하기 */}
                  <Image className={styles.yaho} src={Weekly} alt="주간" />
                  <h3>주간</h3>
                </div>
              </div>
            </button>
            <button
              className={`${styles.TypeButton} ${type === 'monthly' ? styles.isActive : ''}`}
              onClick={() => setType('monthly')}>
              <div className={styles.TypeButtonImg}>
                <div></div>
              </div>
              <div className={styles.TypeButtonInfo}>
                <div>
                  <Image src={Monthly} alt="월관" />
                  <h3>월간</h3>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h1>달력</h1>
        {children}
      </div>
    </div>
  );
}
