'use client';

import React, { useEffect, useRef } from 'react';
import { useNotificationStore } from '../../_store/notification';
import { notificationApi } from '../../_apis/notification';
import NotificationItem from './NotificationItem';
import styles from './NotificationModal.module.scss';

const NotificationModal: React.FC = () => {
  const {
    isModalOpen,
    setModalOpen,
    notifications,
    setNotifications,
    isLoading,
    setLoading,
    markAllAsRead,
    unreadCount,
  } = useNotificationStore();

  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 알림 목록 조회
  useEffect(() => {
    if (isModalOpen) {
      fetchNotifications();
    }
  }, [isModalOpen]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isModalOpen, setModalOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications({ limit: 20 });
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>알림</h3>
          <div className={styles.headerActions}>
            {unreadCount > 0 && (
              <button
                className={styles.markAllReadButton}
                onClick={handleMarkAllAsRead}>
                모두 읽음
              </button>
            )}
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              disabled={isLoading}>
              {isLoading ? '⟳' : '↻'}
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>알림을 불러오는 중...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔔</div>
              <p>새로운 알림이 없습니다</p>
            </div>
          ) : (
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
