'use client';

import React, { useState, useEffect } from 'react';
import {
  NotificationList as NotificationListType,
  NotificationResponse,
  NotificationStatus,
} from '@types';
import { getNotifications, markAsRead, deleteNotification } from '@apis';
import { NotificationItem } from '../notificationItem';
import { InlineLoader } from '@components';

import styled from './styles.module.scss';

interface NotificationListProps {
  initialNotifications?: NotificationListType;
  onUnreadCountChange?: (count: number) => void;
}

export function _NotificationList({
  initialNotifications,
  onUnreadCountChange,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications.notifications);
      setCurrentPage(initialNotifications.currentPage);
      setTotalPages(initialNotifications.totalPages);
      setUnreadCount(initialNotifications.unreadCount);
      setHasMore(
        initialNotifications.currentPage < initialNotifications.totalPages,
      );
    } else {
      loadNotifications();
    }
  }, [initialNotifications]);

  const loadNotifications = async (page = 1, append = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await getNotifications({
        page,
        pageSize,
      });

      if (append) {
        setNotifications((prev) => [...prev, ...result.notifications]);
      } else {
        setNotifications(result.notifications);
      }

      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setUnreadCount(result.unreadCount);
      setHasMore(result.currentPage < result.totalPages);

      if (onUnreadCountChange) {
        onUnreadCountChange(result.unreadCount);
      }
    } catch (error) {
      console.error('알림 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId
            ? {
                ...notification,
                notificationStatus: NotificationStatus.Read,
                notificationReadAt: new Date(),
              }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount - 1);
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);

      const deletedNotification = notifications.find(
        (n) => n.notificationId === notificationId,
      );
      const wasUnread =
        deletedNotification?.notificationStatus === NotificationStatus.Unread;

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.notificationId !== notificationId,
        ),
      );

      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        if (onUnreadCountChange) {
          onUnreadCountChange(unreadCount - 1);
        }
      }
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadNotifications(currentPage + 1, true);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className={styled.loading_container}>
        <InlineLoader text="알림을 불러오는 중..." />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={styled.empty_container}>
        <div className={styled.empty_icon}>📭</div>
        <h3>알림이 없습니다</h3>
        <p>새로운 알림이 도착하면 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className={styled.notification_list}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      ))}

      {hasMore && (
        <div className={styled.load_more_container}>
          {loading ? (
            <InlineLoader size="small" />
          ) : (
            <button
              className={styled.load_more_button}
              onClick={loadMore}
              disabled={loading}>
              더 보기
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const NotificationList = React.memo(_NotificationList);
