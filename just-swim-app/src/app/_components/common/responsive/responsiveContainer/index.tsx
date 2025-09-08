'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  className?: string;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function ResponsiveContainer({
  children,
  breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },
  className = '',
}: ResponsiveContainerProps) {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<Breakpoint>('desktop');
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < breakpoints.mobile) {
        setCurrentBreakpoint('mobile');
      } else if (width < breakpoints.tablet) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return (
    <div
      className={`${styles.container} ${styles[currentBreakpoint]} ${className}`}
      data-breakpoint={currentBreakpoint}
      data-width={windowWidth}>
      {children}
    </div>
  );
}

