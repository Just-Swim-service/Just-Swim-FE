'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function FocusTrap({
  children,
  isActive = true,
  className = '',
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { trapFocus, releaseFocus } = useAccessibility();

  useEffect(() => {
    if (isActive && containerRef.current) {
      const cleanup = trapFocus(containerRef.current);
      return cleanup;
    } else {
      releaseFocus();
    }
  }, [isActive, trapFocus, releaseFocus]);

  return (
    <div
      ref={containerRef}
      className={`${styles.focusTrap} ${className}`}
      tabIndex={-1}>
      {children}
    </div>
  );
}

