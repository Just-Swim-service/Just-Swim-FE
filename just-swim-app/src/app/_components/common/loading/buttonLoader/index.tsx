'use client';

import React from 'react';
import styles from './styles.module.scss';

interface ButtonLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ButtonLoader({
  loading = false,
  children,
  size = 'medium',
  disabled = false,
  className = '',
  onClick,
}: ButtonLoaderProps) {
  const sizeClass = styles[size];
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${styles.button} ${sizeClass} ${className}`}
      disabled={isDisabled}
      onClick={onClick}>
      {loading && <div className={styles.spinner} />}
      <span className={loading ? styles.hidden : styles.visible}>
        {children}
      </span>
    </button>
  );
}

