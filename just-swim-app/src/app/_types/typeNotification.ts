export enum NotificationType {
  Feedback = 'feedback',
  Lecture = 'lecture',
  System = 'system',
  Payment = 'payment',
  Schedule = 'schedule',
}

export enum NotificationStatus {
  Unread = 'unread',
  Read = 'read',
  Deleted = 'deleted',
}

export enum NotificationPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent',
}

export interface Notification {
  notificationId: number;
  userId: number;
  notificationType: NotificationType;
  notificationStatus: NotificationStatus;
  notificationPriority: NotificationPriority;
  notificationTitle: string;
  notificationContent: string;
  notificationLink: string | null;
  notificationData: any;
  notificationReadAt: Date | null;
  notificationScheduledAt: Date | null;
  notificationCreatedAt: Date;
  notificationUpdatedAt: Date;
}

export interface NotificationListResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  type?: NotificationType;
}
