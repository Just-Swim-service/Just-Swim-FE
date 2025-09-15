'use client';

import React from 'react';
import Link from 'next/link';
import { NotificationResponse, NotificationStatus } from '@types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import styled from './styles.module.scss';

interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsRead?: (notificationId: number) => void;
  onDelete?: (notificationId: number) => void;
}

export function _NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const isUnread = notification.notificationStatus === NotificationStatus.Unread;
  const timeAgo = formatDistanceToNow(
    new Date(notification.notificationCreatedAt),
    {
      addSuffix: true,
      locale: ko,
    },
  );

  const getPriorityIcon = () => {
    switch (notification.notificationPriority) {
      case 'urgent':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '🔵';
    }
  };

  const getTypeIcon = () => {
    switch (notification.notificationType) {
      case 'feedback':
        return '💬';
      case 'lecture':
        return '📚';
      case 'system':
        return '⚙️';
      case 'payment':
        return '💳';
      case 'schedule':
        return '📅';
      default:
        return '📢';
    }
  };

  const handleClick = () => {
    if (isUnread && onMarkAsRead) {
      onMarkAsRead(notification.notificationId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.notificationId);
    }
  };

  const content = notification.notificationLink ? (
    <Link
      href={notification.notificationLink}
      className={`${styled.notification_item} ${isUnread ? styled.unread : ''}`}
      onClick={handleClick}>
      <div className={styled.notification_content}>
        <div className={styled.notification_header}>
          <span className={styled.type_icon}>{getTypeIcon()}</span>
          <span className={styled.priority_icon}>{getPriorityIcon()}</span>
          <span className={styled.title}>{notification.notificationTitle}</span>
          <button
            className={styled.delete_button}
            onClick={handleDelete}
            aria-label="알림 삭제">
            ×
          </button>
        </div>
        <div className={styled.content}>{notification.notificationContent}</div>
        <div className={styled.time}>{timeAgo}</div>
      </div>
    </Link>
  ) : (
    <div
      className={`${styled.notification_item} ${isUnread ? styled.unread : ''}`}
      onClick={handleClick}>
      <div className={styled.notification_content}>
        <div className={styled.notification_header}>
          <span className={styled.type_icon}>{getTypeIcon()}</span>
          <span className={styled.priority_icon}>{getPriorityIcon()}</span>
          <span className={styled.title}>{notification.notificationTitle}</span>
          <button
            className={styled.delete_button}
            onClick={handleDelete}
            aria-label="알림 삭제">
            ×
          </button>
        </div>
        <div className={styled.content}>{notification.notificationContent}</div>
        <div className={styled.time}>{timeAgo}</div>
      </div>
    </div>
  );

  return content;
}

export const NotificationItem = React.memo(_NotificationItem);
