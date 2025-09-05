'use client';

import React from 'react';
import styles from './styles.module.scss';

interface ProfileSkeletonProps {
  showStats?: boolean;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ProfileSkeleton({
  showStats = true,
  showActions = true,
  size = 'medium',
}: ProfileSkeletonProps) {
  const sizeClass = styles[size];

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      <div className={styles.avatar} />

      <div className={styles.content}>
        <div className={styles.name} />
        <div className={styles.email} />
        <div className={styles.bio} />

        {showStats && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue} />
              <div className={styles.statLabel} />
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue} />
              <div className={styles.statLabel} />
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue} />
              <div className={styles.statLabel} />
            </div>
          </div>
        )}

        {showActions && (
          <div className={styles.actions}>
            <div className={styles.button} />
            <div className={styles.button} />
          </div>
        )}
      </div>
    </div>
  );
}
