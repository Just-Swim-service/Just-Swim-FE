'use client';

import { useState } from 'react';
import styles from './Common.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState('weekly');
  const handleBottomNavClick = (buttonName: string) => {
    console.log('Button clicked:', buttonName);
    // 클릭된 버튼에 따른 동작 추가
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.topNavBar}>
          <div>페이지 위치</div>
          <button>설정</button>
        </div>
        <div className={styles.todayInfo}>
          <p>13일 토요일, 오늘</p>
          <h1>이후 등록된 수업이 없습니다.</h1>
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
                  <h3>주간</h3>
                </div>
              </div>
            </button>
          </div>
          <button
            className={`${styles.TypeButton} ${type === 'monthly' ? styles.isActive : ''}`}
            onClick={() => setType('monthly')}>
            <div className={styles.TypeButtonImg}>
              <div></div>
            </div>
            <div className={styles.TypeButtonInfo}>
              <div>
                <h3>월간</h3>
              </div>
            </div>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
