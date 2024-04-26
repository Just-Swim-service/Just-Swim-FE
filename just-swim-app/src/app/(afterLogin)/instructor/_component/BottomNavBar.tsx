'use client';

import Link from 'next/link';
import './bottomNavBar.scss';
import { useState } from 'react';

export default function BottomNavBar() {
  const [type, setType] = useState('schedule');

  const handleBottomNavClick = (pageType: string) => {
    setType(pageType);
  };

  return (
    <div className="bottom_nav_bar_wrapper">
      <Link
        href="/instructor/classList/classListTabs"
        className={`bottom_nav_bar ${type === 'classList' ? 'active' : ''}`}>
        <button onClick={() => handleBottomNavClick('classList')}>수업</button>
      </Link>
      <Link
        href="/instructor/schedule/weekly/classList"
        className={`bottom_nav_bar ${type === 'schedule' ? 'active' : ''}`}>
        <button onClick={() => handleBottomNavClick('schedule')}>홈</button>
      </Link>
      <Link
        href="/instructor/feedback"
        className={`bottom_nav_bar ${type === 'feedback' ? 'active' : ''}`}>
        <button onClick={() => handleBottomNavClick('feedback')}>피드백</button>
      </Link>
    </div>
  );
}
