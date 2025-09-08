'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface DesktopOnlyProps {
  children: React.ReactNode;
  breakpoint?: number;
  className?: string;
}

export function DesktopOnly({
  children,
  breakpoint = 768,
  className = '',
}: DesktopOnlyProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  if (!isDesktop) return null;

  return <div className={`${styles.desktopOnly} ${className}`}>{children}</div>;
}

