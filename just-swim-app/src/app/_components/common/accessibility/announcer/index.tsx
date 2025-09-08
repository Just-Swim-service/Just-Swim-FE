'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

interface AnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export function Announcer({
  message,
  priority = 'polite',
  className = '',
}: AnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');
  const { announce } = useAccessibility();

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      announce(message, priority);

      // 메시지 초기화
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message, priority, announce]);

  if (!announcement) return null;

  return (
    <div
      className={`${styles.announcer} ${className}`}
      aria-live={priority}
      aria-atomic="true">
      {announcement}
    </div>
  );
}

