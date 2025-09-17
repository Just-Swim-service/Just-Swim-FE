import { create } from 'zustand';
import { Notification, NotificationStatus } from '../_types/typeNotification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isModalOpen: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setModalOpen: (open: boolean) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: number) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (
    notificationId: number,
    updates: Partial<Notification>,
  ) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  console.log('🔔 [NotificationStore] 스토어 초기화됨');
  
  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isModalOpen: false,

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => {
    console.log('🔔 [NotificationStore] setUnreadCount 호출됨, count:', count);
    set({ unreadCount: count });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setModalOpen: (open) => set({ isModalOpen: open }),

  markAsRead: (notificationId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.notificationId === notificationId
        ? {
            ...notification,
            notificationStatus: NotificationStatus.Read,
            notificationReadAt: new Date(),
          }
        : notification,
    );

    const unreadCount = updatedNotifications.filter(
      (n) => n.notificationStatus === NotificationStatus.Unread,
    ).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      notificationStatus: NotificationStatus.Read,
      notificationReadAt: new Date(),
    }));

    set({
      notifications: updatedNotifications,
      unreadCount: 0,
    });
  },

  removeNotification: (notificationId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.filter(
      (n) => n.notificationId !== notificationId,
    );
    const unreadCount = updatedNotifications.filter(
      (n) => n.notificationStatus === NotificationStatus.Unread,
    ).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  addNotification: (notification) => {
    const { notifications } = get();
    const updatedNotifications = [notification, ...notifications];
    const unreadCount = updatedNotifications.filter(
      (n) => n.notificationStatus === NotificationStatus.Unread,
    ).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  updateNotification: (notificationId, updates) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.notificationId === notificationId
        ? { ...notification, ...updates }
        : notification,
    );
    const unreadCount = updatedNotifications.filter(
      (n) => n.notificationStatus === NotificationStatus.Unread,
    ).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });
  },
}));
