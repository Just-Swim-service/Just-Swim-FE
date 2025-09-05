'use client';

import React from 'react';
import styles from './styles.module.scss';

interface CardSkeletonProps {
  count?: number;
  height?: number;
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

export function CardSkeleton({
  count = 1,
  height = 120,
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  showActions = true,
}: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card} style={{ height }}>
          {showAvatar && <div className={styles.avatar} />}

          <div className={styles.content}>
            {showTitle && <div className={styles.title} />}

            {showDescription && (
              <div className={styles.description}>
                <div className={styles.line} />
                <div className={styles.line} />
                <div className={styles.lineShort} />
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
      ))}
    </>
  );
}
