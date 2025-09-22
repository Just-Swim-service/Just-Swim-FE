'use client';

import React from 'react';
import { Notification, NotificationType, NotificationPriority } from '@types';
import { useNotificationStore } from '@store';
import { notificationApi } from '@apis';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotificationStore();

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Feedback:
        return '💬';
      case NotificationType.Lecture:
        return '📚';
      case NotificationType.System:
        return '⚙️';
      case NotificationType.Payment:
        return '💳';
      case NotificationType.Schedule:
        return '📅';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.Urgent:
        return '#ff4444';
      case NotificationPriority.High:
        return '#ff8800';
      case NotificationPriority.Medium:
        return '#007bff';
      case NotificationPriority.Low:
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const handleClick = async () => {
    if (notification.notificationStatus === 'unread') {
      try {
        await notificationApi.markAsRead(notification.notificationId);
        markAsRead(notification.notificationId);
        // 읽음 처리 후 알림을 목록에서 제거
        removeNotification(notification.notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // 링크가 있으면 해당 페이지로 이동
    if (notification.notificationLink) {
      window.location.href = notification.notificationLink;
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(notification.notificationId);
      removeNotification(notification.notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const timeAgo = formatDistanceToNow(
    new Date(notification.notificationCreatedAt),
    {
      addSuffix: true,
      locale: ko,
    },
  );

  return (
    <div
      className={`${styles.notificationItem} ${
        notification.notificationStatus === 'unread' ? styles.unread : ''
      }`}
      onClick={handleClick}>
      <div className={styles.iconContainer}>
        <span className={styles.typeIcon}>
          {getTypeIcon(notification.notificationType)}
        </span>
        {notification.notificationStatus === 'unread' && (
          <div
            className={styles.unreadDot}
            style={{
              backgroundColor: getPriorityColor(
                notification.notificationPriority,
              ),
            }}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{notification.notificationTitle}</h4>
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="알림 삭제">
            ✕
          </button>
        </div>

        <p className={styles.description}>{notification.notificationContent}</p>

        <div className={styles.footer}>
          <span className={styles.time}>{timeAgo}</span>
          {notification.notificationPriority === NotificationPriority.Urgent && (
            <span className={styles.urgentLabel}>긴급</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
