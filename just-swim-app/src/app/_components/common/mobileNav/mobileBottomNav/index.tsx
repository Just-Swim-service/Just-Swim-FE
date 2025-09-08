'use client';

import React, { useState } from 'react';
import { useTouch } from '@hooks';
import styles from './styles.module.scss';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface MobileBottomNavProps {
  items: NavItem[];
  onItemClick: (item: NavItem) => void;
  className?: string;
}

export function MobileBottomNav({
  items,
  onItemClick,
  className = '',
}: MobileBottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { touchStart, touchMove, touchEnd } = useTouch({
    onSwipeUp: () => setIsVisible(false),
    onSwipeDown: () => setIsVisible(true),
  });

  React.useEffect(() => {
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
    <nav
      className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden} ${className}`}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      <div className={styles.container}>
        {items.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
            onClick={() => onItemClick(item)}>
            <div className={styles.icon}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

