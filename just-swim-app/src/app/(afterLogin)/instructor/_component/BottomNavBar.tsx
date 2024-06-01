'use client';

import styled from './bottomNavBar.module.scss';
import Link from 'next/link';
import { useState } from 'react';

export default function BottomNavBar() {
  const [type, setType] = useState('schedule');

  const handleBottomNavClick = (pageType: string) => {
    setType(pageType);
  };

  return (
    <div className={styled.bottom_nav_bar_wrapper}>
      <Link
        href="/instructor/classList/classListTabs"
        className={`${styled.bottom_nav_bar} ${styled[type === 'classList' ? 'active' : '']}`}>
        <button onClick={() => handleBottomNavClick('classList')}>수업</button>
      </Link>
      <Link
        href="/instructor/schedule/weekly/classList"
        className={`${styled.bottom_nav_bar} ${styled[type === 'schedule' ? 'active' : '']}`}>
        <button onClick={() => handleBottomNavClick('schedule')}>홈</button>
      </Link>
      <Link
        href="/instructor/feedback/feedbackView"
        className={`${styled.bottom_nav_bar} ${styled[type === 'feedback' ? 'active' : '']}`}>
        <button onClick={() => handleBottomNavClick('feedback')}>피드백</button>
      </Link>
    </div>
  );
}
