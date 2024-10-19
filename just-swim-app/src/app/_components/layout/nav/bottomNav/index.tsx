'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  IconCalendarHome,
  IconClass,
  IconFeedback,
} from '@assets';

import styled from './styles.module.scss';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className={styled.container}>
      <div className={styled.list}>
        <Link
          href="/schedule"
          className={`${styled.item} ${pathname.startsWith('/schedule') && styled.selected}`}>
            <IconCalendarHome width={22} height={22} />
            <span>홈</span>
        </Link>
        <Link
          href="/instructor/class"
          className={`${styled.item} ${pathname.startsWith('/class') && styled.selected}`}>
            <IconClass width={22} height={22} />
            <span>수업</span>
        </Link>
        <Link
          href="/feedback"
          className={`${styled.item} ${pathname.startsWith('/feedback') && styled.selected}`}>
            <IconFeedback width={22} height={22} />
            <span>피드백</span>
        </Link>
      </div>
      <div className={styled.divider} />
    </div>
  )
}