'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './styles.module.scss';

export function ScheduleCommonSkeleton() {
  return (
    <section className={styles.container}>
      <header className={styles.today_info}>
        <h2>
          <Skeleton width={160} height={20} className={styles.today} />
          <Skeleton width={200} height={28} className={styles.today_schedule} />
        </h2>
      </header>
      <div className={styles.schedule_tab}>
        <Skeleton width="100%" height={40} className={styles.schedule_link} />
        <Skeleton width="100%" height={40} className={styles.schedule_link} />
      </div>
    </section>
  );
}
