'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface BreakpointProps {
  children: React.ReactNode;
  min?: number;
  max?: number;
  className?: string;
}

export function Breakpoint({
  children,
  min = 0,
  max = Infinity,
  className = '',
}: BreakpointProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsVisible(width >= min && width <= max);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [min, max]);

  if (!isVisible) return null;

  return <div className={`${styles.breakpoint} ${className}`}>{children}</div>;
}

