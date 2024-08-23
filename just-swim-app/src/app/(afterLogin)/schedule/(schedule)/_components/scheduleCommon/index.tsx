'use client';

import { usePathname  } from 'next/navigation';
import Link from "next/link";

import { WEEK_DAYS } from '@data';
import { getToday } from '@utils';

import styled from './styles.module.scss';

export function ScheduleCommon({
  count
}: {
  count: number,
}) {
  const pathname = usePathname();

  const today = getToday();

  return (
    <section className={styled.container}>
      <header className={styled.today_info}>
        <h2>
          <span className={styled.today}>{`${today.getDate()}일 ${WEEK_DAYS[today.getDay()]}요일, 오늘`}</span>
          <span className={styled.today_schedule}>
            {
              count === 0
              ? '이후 등록된 수업이 없습니다.'
              : <>
                <span>{`예정된 수업이 `}</span>
                <span className={styled.strong}>{count}</span>
                <span>{`개 있습니다.`}</span>
              </>
            }
          </span>
        </h2>
      </header>
      <div className={styled.schedule_tab}>
        <Link
          href="/schedule/weekly"
          className={`${styled.schedule_link} ${pathname === '/schedule/weekly' ? styled.active : ''}`}
        >
          <span>주간</span>
        </Link>
        <Link
          href="/schedule/monthly"
          className={`${styled.schedule_link} ${pathname === '/schedule/monthly' ? styled.active : ''}`}
        >
          <span>월간</span>
        </Link>
      </div>
    </section>
  )
}