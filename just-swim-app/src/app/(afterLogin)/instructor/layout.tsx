'use client';

import { useState } from 'react';
import styles from './Common.module.css';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState('');

  const handleBottomNavClick = (pageType: string) => {
    setType(pageType);
  };

  return (
    <div className={styles.container}>
      {children}
      <div className={styles.footer}>
        {/* 네비게이션 바 */}
        <div className={styles.bottomNavBarWrapper}>
          <Link href="/instructor/classManagement">
            <button
              className={`${type === 'classManagement' ? styles.isActive : ''}`}
              onClick={() => handleBottomNavClick('classManagement')}>
              수업
            </button>
          </Link>
          <Link href="/instructor/schedule">
            <button
              className={`${type === 'schedule' ? styles.isActive : ''}`}
              onClick={() => handleBottomNavClick('schedule')}>
              홈
            </button>
          </Link>
          <Link href="/instructor/feedback">
            <button
              className={`${type === 'feedback' ? styles.isActive : ''}`}
              onClick={() => handleBottomNavClick('feedback')}>
              피드백
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
