'use client';

import React, { useRef, useState } from 'react';
import { useTouch } from '@hooks';
import { Portal } from '@components';
import styles from './styles.module.scss';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  position = 'bottom',
  size = 'medium',
  className = '',
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  const { touchStart, touchMove, touchEnd } = useTouch({
    onSwipeDown: position === 'bottom' ? onClose : undefined,
    onSwipeUp: position === 'top' ? onClose : undefined,
    onSwipeLeft: position === 'right' ? onClose : undefined,
    onSwipeRight: position === 'left' ? onClose : undefined,
  });

  const handleTouchStart = (event: React.TouchEvent) => {
    if (position === 'bottom' || position === 'top') {
      touchStart(event);
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (position === 'bottom' || position === 'top') {
      touchMove(event);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (position === 'bottom' || position === 'top') {
      touchEnd(event);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className={styles.overlay} onClick={onClose}>
        <div
          ref={drawerRef}
          className={`${styles.drawer} ${styles[position]} ${styles[size]} ${className}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <div className={styles.handle} />
          {children}
        </div>
      </div>
    </Portal>
  );
}
