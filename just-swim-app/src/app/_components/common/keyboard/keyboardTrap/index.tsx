'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

interface KeyboardTrapProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function KeyboardTrap({
  children,
  isActive = true,
  className = '',
}: KeyboardTrapProps) {
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
      className={`${styles.keyboardTrap} ${className}`}
      tabIndex={-1}>
      {children}
    </div>
  );
}
