'use client';

import React, { useState, useEffect } from 'react';
import {
  NotificationList as NotificationListType,
  NotificationStats,
} from '@types';
import { NotificationHeader, NotificationList } from '@components';
import { getNotificationStats } from '@apis';

import styled from './styles.module.scss';

interface NotificationPageProps {
  initialNotifications?: NotificationListType;
  initialStats?: NotificationStats;
}

export function NotificationPage({
  initialNotifications,
  initialStats,
}: NotificationPageProps) {
  const [stats, setStats] = useState<NotificationStats>(
    initialStats || {
      total: 0,
      unread: 0,
      byType: {},
      byPriority: {},
    },
  );

  const [unreadCount, setUnreadCount] = useState(initialStats?.unread || 0);

  useEffect(() => {
    // 실시간으로 읽지 않은 알림 개수 업데이트
    const updateStats = async () => {
      try {
        const currentStats = await getNotificationStats();
        setStats(currentStats);
        setUnreadCount(currentStats.unread);
      } catch (error) {
        console.error('알림 통계 업데이트 실패:', error);
      }
    };

    // 5분마다 통계 업데이트
    const interval = setInterval(updateStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStatsChange = (newStats: NotificationStats) => {
    setStats(newStats);
    setUnreadCount(newStats.unread);
  };

  const handleUnreadCountChange = (count: number) => {
    setUnreadCount(count);
    setStats((prev) => ({ ...prev, unread: count }));
  };

  return (
    <div className={styled.notification_page}>
      <div className={styled.container}>
        <NotificationHeader
          stats={stats}
          onStatsChange={handleStatsChange}
          onUnreadCountChange={handleUnreadCountChange}
        />

        <NotificationList
          initialNotifications={initialNotifications}
          onUnreadCountChange={handleUnreadCountChange}
        />
      </div>
    </div>
  );
}
