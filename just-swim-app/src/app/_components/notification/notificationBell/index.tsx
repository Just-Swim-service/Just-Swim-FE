'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnreadCount } from '@apis';
import { UnreadCountResponse } from '@types';

import styled from './styles.module.scss';

interface NotificationBellProps {
  className?: string;
}

export function _NotificationBell({ className }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response: UnreadCountResponse = await getUnreadCount();
        setUnreadCount(response.unreadCount);
      } catch (error) {
        console.error('읽지 않은 알림 개수 조회 실패:', error);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // 1분마다 읽지 않은 알림 개수 업데이트
    const interval = setInterval(fetchUnreadCount, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/notification"
      className={`${styled.notification_bell} ${className || ''}`}>
      <div className={styled.bell_icon}>🔔</div>
      {!loading && unreadCount > 0 && (
        <span className={styled.unread_badge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export const NotificationBell = React.memo(_NotificationBell);
