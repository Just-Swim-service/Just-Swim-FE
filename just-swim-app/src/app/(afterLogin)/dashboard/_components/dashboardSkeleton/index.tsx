'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './styles.module.scss';

export function DashboardSkeleton() {
  return (
    <div className={styles.container}>
      {/* 레벨 & 활동 섹션 */}
      <section className={styles.section}>
        <Skeleton height={24} width={120} className={styles.sectionTitle} />
        <div className={styles.levelProgress}>
          <Skeleton height={80} borderRadius={12} />
        </div>
      </section>

      {/* 배지 섹션 */}
      <section className={styles.section}>
        <Skeleton height={24} width={150} className={styles.sectionTitle} />
        <div className={styles.badgeList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={60} width={60} borderRadius={50} />
          ))}
        </div>
      </section>

      {/* 통계 카드 */}
      <section className={styles.section}>
        <Skeleton height={24} width={80} className={styles.sectionTitle} />
        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.statCard}>
              <Skeleton height={40} width={40} borderRadius={8} />
              <Skeleton height={32} width={60} />
              <Skeleton height={16} width={100} />
            </div>
          ))}
        </div>
      </section>

      {/* 차트 섹션 */}
      <section className={styles.section}>
        <Skeleton height={24} width={120} className={styles.sectionTitle} />
        <Skeleton height={200} borderRadius={12} />
      </section>
    </div>
  );
}

