'use client';

import { useState } from 'react';
import styles from './Common.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState('schedule');

  const handleBottomNavClick = (pageType: string) => {
    console.log('Button clicked:', pageType);
    setType(pageType);
  };

  return (
    <div className={styles.container}>
      {children}
      <div className={styles.footer}>
        {/* 네비게이션 바 */}
        <div className={styles.bottomNavBar}>
          <Link
            href="/instructor/classmangement"
            className={`${type === 'classmanagement' ? styles.isActive : ''}`}>
            <button onClick={() => handleBottomNavClick('classmangement')}>
              수업
            </button>
          </Link>
          <Link
            href="/instructor/schedule"
            className={`${type === 'schedule' ? styles.isActive : ''}`}>
            <button onClick={() => handleBottomNavClick('schedule')}>홈</button>
          </Link>
          <Link
            href="/instructor/feedback"
            className={`${type === 'feedback' ? styles.isActive : ''}`}>
            <button onClick={() => handleBottomNavClick('feedback')}>
              피드백
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
