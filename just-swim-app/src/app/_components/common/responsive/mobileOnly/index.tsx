'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface MobileOnlyProps {
  children: React.ReactNode;
  breakpoint?: number;
  className?: string;
}

export function MobileOnly({
  children,
  breakpoint = 768,
  className = '',
}: MobileOnlyProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  if (!isMobile) return null;

  return <div className={`${styles.mobileOnly} ${className}`}>{children}</div>;
}
