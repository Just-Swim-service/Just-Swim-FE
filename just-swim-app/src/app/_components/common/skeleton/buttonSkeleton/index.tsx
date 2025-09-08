'use client';

import React from 'react';
import styles from './styles.module.scss';

interface ButtonSkeletonProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export function ButtonSkeleton({
  count = 1,
  size = 'medium',
  variant = 'primary',
  fullWidth = false,
}: ButtonSkeletonProps) {
  const sizeClass = styles[size];
  const variantClass = styles[variant];
  const fullWidthClass = fullWidth ? styles.fullWidth : '';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.button} ${sizeClass} ${variantClass} ${fullWidthClass}`}
        />
      ))}
    </>
  );
}

