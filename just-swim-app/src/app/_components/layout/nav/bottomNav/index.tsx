'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  IconCalendarHome,
  IconClass,
  IconFeedback,
  IconCommunity,
} from '@assets';
import { useTouch } from '@hooks';

import styled from './styles.module.scss';

export function BottomNav() {
  const pathname = usePathname();
  const isMonthly = pathname === '/schedule/monthly';
  const { handleTap } = useTouch();

  return (
    <div
      className={`${styled.container} ${isMonthly ? styled.static : styled.fixed}`}>
      <div className={styled.list}>
        <Link
          href="/schedule"
          className={`${styled.item} ${pathname.startsWith('/schedule') && styled.selected}`}
          {...handleTap()}
          aria-label="홈으로 이동"
          role="button">
          <IconCalendarHome width={22} height={22} />
          <span>홈</span>
        </Link>
        <Link
          href="/class"
          className={`${styled.item} ${pathname.startsWith('/class') && styled.selected}`}
          {...handleTap()}
          aria-label="수업으로 이동"
          role="button">
          <IconClass width={22} height={22} />
          <span>수업</span>
        </Link>
        <Link
          href="/feedback"
          className={`${styled.item} ${pathname.startsWith('/feedback') && styled.selected}`}
          {...handleTap()}
          aria-label="피드백으로 이동"
          role="button">
          <IconFeedback width={22} height={22} />
          <span>피드백</span>
        </Link>
        <Link
          href="/community"
          className={`${styled.item} ${pathname.startsWith('/community') && styled.selected}`}
          {...handleTap()}
          aria-label="커뮤니티로 이동"
          role="button">
          <IconCommunity width={22} height={22} />
          <span>커뮤니티</span>
        </Link>
      </div>
      <div className={styled.divider} />
    </div>
  );
}
