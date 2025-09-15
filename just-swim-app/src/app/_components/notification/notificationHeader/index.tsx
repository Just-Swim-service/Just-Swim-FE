'use client';

import React from 'react';
import { NotificationStats } from '@types';
import { markAllAsRead, deleteAllNotifications } from '@apis';

import styled from './styles.module.scss';

interface NotificationHeaderProps {
  stats: NotificationStats;
  onStatsChange?: (stats: NotificationStats) => void;
  onUnreadCountChange?: (count: number) => void;
}

export function _NotificationHeader({
  stats,
  onStatsChange,
  onUnreadCountChange,
}: NotificationHeaderProps) {
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      const updatedStats = {
        ...stats,
        unread: 0,
      };

      if (onStatsChange) {
        onStatsChange(updatedStats);
      }

      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('모든 알림을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteAllNotifications();

      const updatedStats = {
        ...stats,
        total: 0,
        unread: 0,
        byType: {},
        byPriority: {},
      };

      if (onStatsChange) {
        onStatsChange(updatedStats);
      }

      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('모든 알림 삭제 실패:', error);
    }
  };

  return (
    <div className={styled.header}>
      <div className={styled.header_content}>
        <div className={styled.title_section}>
          <h1 className={styled.title}>알림</h1>
          {stats.unread > 0 && (
            <span className={styled.unread_badge}>{stats.unread}</span>
          )}
        </div>

        <div className={styled.stats_section}>
          <div className={styled.stat_item}>
            <span className={styled.stat_label}>전체</span>
            <span className={styled.stat_value}>{stats.total}</span>
          </div>
          <div className={styled.stat_item}>
            <span className={styled.stat_label}>읽지 않음</span>
            <span className={styled.stat_value}>{stats.unread}</span>
          </div>
        </div>
      </div>

      <div className={styled.action_buttons}>
        {stats.unread > 0 && (
          <button
            className={styled.action_button}
            onClick={handleMarkAllAsRead}
            title="모두 읽음 처리">
            ✓ 모두 읽음
          </button>
        )}
        {stats.total > 0 && (
          <button
            className={`${styled.action_button} ${styled.delete_button}`}
            onClick={handleDeleteAll}
            title="모든 알림 삭제">
            🗑️ 모두 삭제
          </button>
        )}
      </div>
    </div>
  );
}

export const NotificationHeader = React.memo(_NotificationHeader);
