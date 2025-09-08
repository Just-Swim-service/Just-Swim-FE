'use client';

import React, { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  loadingText?: string;
}

export function ButtonLoader({
  loading = false,
  children,
  size = 'medium',
  disabled = false,
  className = '',
  loadingText,
  ...props
}: ButtonLoaderProps) {
  const sizeClass = styles[size];
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      className={`${styles.button} ${sizeClass} ${className}`}
      disabled={isDisabled}>
      {loading && <div className={styles.spinner} />}
      <span className={loading ? styles.hidden : styles.visible}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}
