'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styled from './styles.module.scss';
import { IconNavCalendar } from '@assets';
import { IconHome } from '@assets';
import { IconSendFeedback } from '@assets';
import { usePathname } from 'next/navigation';

export function InstructorBottomNavBar() {
  const pathname = usePathname();
  const [type, setType] = useState('');

  useEffect(() => {
    let path = pathname.split('/');
    setType(path[path.length - 1]);
  }, []);

  const handleBottomNavClick = (pageType: string) => {
    const currentPath = pathname.includes(pageType) ? pageType : '';
    setType(currentPath);
  };

  return (
    <div className={styled.bottom_nav_bar_wrapper}>
      <Link
        href="/instructor/class"
        className={`${styled.bottom_nav_bar} ${styled[type === 'classList' ? 'active' : '']}`}>
        <IconNavCalendar />
        <button onClick={() => handleBottomNavClick('classList')}>수업</button>
      </Link>
      <Link
        href="/instructor/schedule"
        className={`${styled.bottom_nav_bar} ${styled[type === 'schedule' ? 'active' : '']}`}>
        <IconHome />
        <button onClick={() => handleBottomNavClick('schedule')}>홈</button>
      </Link>
      <Link
        href="/instructor/feedback"
        className={`${styled.bottom_nav_bar} ${styled[type === 'feedback' ? 'active' : '']}`}>
        <IconSendFeedback />
        <button onClick={() => handleBottomNavClick('feedback')}>피드백</button>
      </Link>
    </div>
  );
}
