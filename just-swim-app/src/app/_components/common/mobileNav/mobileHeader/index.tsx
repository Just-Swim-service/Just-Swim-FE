'use client';

import React, { useState, useEffect } from 'react';
import { useTouch } from '@hooks';
import styles from './styles.module.scss';

interface MobileHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export function MobileHeader({
  title,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  showBackButton = false,
  onBackClick,
  className = '',
}: MobileHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { touchStart, touchMove, touchEnd } = useTouch({
    onSwipeUp: () => setIsVisible(false),
    onSwipeDown: () => setIsVisible(true),
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 스크롤 다운
        setIsVisible(false);
      } else {
        // 스크롤 업
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`${styles.header} ${isVisible ? styles.visible : styles.hidden} ${className}`}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      <div className={styles.container}>
        <div className={styles.left}>
          {showBackButton && (
            <button className={styles.backButton} onClick={onBackClick}>
              ←
            </button>
          )}
          {leftIcon && (
            <button className={styles.iconButton} onClick={onLeftClick}>
              {leftIcon}
            </button>
          )}
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.right}>
          {rightIcon && (
            <button className={styles.iconButton} onClick={onRightClick}>
              {rightIcon}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
