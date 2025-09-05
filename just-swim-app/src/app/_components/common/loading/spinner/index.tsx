'use client';

import React from 'react';
import styles from './styles.module.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export function Spinner({
  size = 'medium',
  color = '#3b82f6',
  className = '',
}: SpinnerProps) {
  const sizeClass = styles[size];

  return (
    <div
      className={`${styles.spinner} ${sizeClass} ${className}`}
      style={{ borderColor: color }}
    />
  );
}
