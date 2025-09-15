'use client';

import React, { useState, useEffect } from 'react';
import {
  NotificationList as NotificationListType,
  NotificationStats,
} from '@types';
import { NotificationHeader, NotificationList } from '@components';
import { HistoryBackHeader } from '@components';
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
    // 초기 데이터 로드
    const loadInitialData = async () => {
      try {
        const currentStats = await getNotificationStats();
        setStats(currentStats);
        setUnreadCount(currentStats.unread);
      } catch (error) {
        console.error('알림 통계 로드 실패:', error);
        // 에러가 발생해도 기본값으로 설정하여 페이지가 정상 렌더링되도록 함
        setStats({
          total: 0,
          unread: 0,
          byType: {},
          byPriority: {},
        });
        setUnreadCount(0);
      }
    };

    loadInitialData();

    // 5분마다 통계 업데이트
    const interval = setInterval(loadInitialData, 5 * 60 * 1000);

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
      <HistoryBackHeader title="알림" />
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
