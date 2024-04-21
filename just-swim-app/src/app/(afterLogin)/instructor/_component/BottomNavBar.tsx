"use client"

import Link from 'next/link';
import styles from './BottomNavBar.module.css';
import { useState } from 'react';

export default function BottomNavBar() {
  const [type, setType] = useState('schedule');

  const handleBottomNavClick = (pageType: string) => {
    setType(pageType);
  };

  return (
    <div className={styles.footer}>
      {/* 네비게이션 바 */}
      <div className={styles.bottomNavBarWrapper}>
        <Link href="/instructor/classList/classListTabs">
          <button
            className={`${type === 'classList' ? styles.isActive : ''}`}
            onClick={() => handleBottomNavClick('classList')}>
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
  );
}
