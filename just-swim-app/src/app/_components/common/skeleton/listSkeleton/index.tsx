'use client';

import React from 'react';
import styles from './styles.module.scss';

interface ListSkeletonProps {
  count?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  itemHeight?: number;
}

export function ListSkeleton({
  count = 5,
  showHeader = true,
  showPagination = true,
  itemHeight = 60,
}: ListSkeletonProps) {
  return (
    <div className={styles.container}>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.title} />
          <div className={styles.subtitle} />
        </div>
      )}

      <div className={styles.list}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ height: itemHeight }}>
            <div className={styles.icon} />
            <div className={styles.content}>
              <div className={styles.primary} />
              <div className={styles.secondary} />
            </div>
            <div className={styles.action} />
          </div>
        ))}
      </div>

      {showPagination && (
        <div className={styles.pagination}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.pageButton} />
          ))}
        </div>
      )}
    </div>
  );
}
