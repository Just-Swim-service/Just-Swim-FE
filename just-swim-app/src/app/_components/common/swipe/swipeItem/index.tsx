'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTouch } from '@hooks';
import styles from './styles.module.scss';

interface SwipeItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  enableSwipe?: boolean;
  enableTap?: boolean;
  enableLongPress?: boolean;
  className?: string;
}

export function SwipeItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  threshold = 50,
  enableSwipe = true,
  enableTap = true,
  enableLongPress = false,
  className = '',
}: SwipeItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  const { touchStart, touchMove, touchEnd, isDragging, dragDistance } = useTouch(
    {
      threshold,
      onSwipeLeft: enableSwipe ? onSwipeLeft : undefined,
      onSwipeRight: enableSwipe ? onSwipeRight : undefined,
      onSwipeUp: enableSwipe ? onSwipeUp : undefined,
      onSwipeDown: enableSwipe ? onSwipeDown : undefined,
      onTap: enableTap ? onTap : undefined,
      onLongPress: enableLongPress ? onLongPress : undefined,
    },
  );

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsPressed(true);
    touchStart(event);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    setIsPressed(false);
    touchEnd(event);
  };

  useEffect(() => {
    if (isDragging && itemRef.current) {
      itemRef.current.style.transition = 'none';
      itemRef.current.style.transform = `translate(${dragDistance.x}px, ${dragDistance.y}px)`;
    } else if (!isDragging && itemRef.current) {
      itemRef.current.style.transition = 'transform 0.3s ease-out';
      itemRef.current.style.transform = 'translate(0, 0)';
    }
  }, [isDragging, dragDistance]);

  return (
    <div
      ref={itemRef}
      className={`${styles.item} ${isPressed ? styles.pressed : ''} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={touchMove}
      onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}

