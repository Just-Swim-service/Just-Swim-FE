'use client';

import React from 'react';
import styles from './styles.module.scss';

interface InlineLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

export function InlineLoader({
  size = 'medium',
  text = '로딩 중...',
  color = '#3b82f6',
}: InlineLoaderProps) {
  const sizeClass = styles[size];

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      <div className={styles.spinner} style={{ borderColor: color }} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
