'use client';

import React from 'react';
import styles from './styles.module.scss';

interface SwipeIndicatorProps {
  currentIndex: number;
  totalItems: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function SwipeIndicator({
  currentIndex,
  totalItems,
  direction = 'horizontal',
  className = '',
}: SwipeIndicatorProps) {
  if (totalItems <= 1) return null;

  return (
    <div className={`${styles.container} ${styles[direction]} ${className}`}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <div
          key={index}
          className={`${styles.dot} ${
            index === currentIndex ? styles.active : ''
          }`}
        />
      ))}
    </div>
  );
}
