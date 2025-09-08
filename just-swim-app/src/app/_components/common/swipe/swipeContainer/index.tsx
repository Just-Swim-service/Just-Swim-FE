'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTouch } from '@hooks';
import styles from './styles.module.scss';

interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableVertical?: boolean;
  enableHorizontal?: boolean;
  className?: string;
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enableVertical = true,
  enableHorizontal = true,
  className = '',
}: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { touchStart, touchMove, touchEnd, isDragging, dragDistance } = useTouch(
    {
      threshold,
      onSwipeLeft: enableHorizontal ? onSwipeLeft : undefined,
      onSwipeRight: enableHorizontal ? onSwipeRight : undefined,
      onSwipeUp: enableVertical ? onSwipeUp : undefined,
      onSwipeDown: enableVertical ? onSwipeDown : undefined,
    },
  );

  useEffect(() => {
    if (isDragging && containerRef.current) {
      containerRef.current.style.transition = 'none';
      containerRef.current.style.transform = `translate(${dragDistance.x}px, ${dragDistance.y}px)`;
    } else if (!isDragging && containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out';
      containerRef.current.style.transform = 'translate(0, 0)';
    }
  }, [isDragging, dragDistance]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      {children}
    </div>
  );
}

