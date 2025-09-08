'use client';

import React, { forwardRef } from 'react';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      loading = false,
      loadingText = '로딩 중...',
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const { isKeyboardUser, reducedMotion } = useAccessibility();
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${
          isKeyboardUser ? styles.keyboardUser : ''
        } ${reducedMotion ? styles.reducedMotion : ''} ${className}`}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}>
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.loadingText}>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

AccessibleButton.displayName = 'AccessibleButton';

