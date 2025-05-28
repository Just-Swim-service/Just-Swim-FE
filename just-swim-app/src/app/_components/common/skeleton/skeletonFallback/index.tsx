'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './styles.module.scss';

export function SkeletonFallback() {
  return (
    <div className={styles.wrapper}>
      <Skeleton className={styles.title} height={30} width={200} />
      <Skeleton className={styles.line} count={5} height={20} />
    </div>
  );
}
