// 알림 타입 정의
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

// 알림 응답 DTO
export interface NotificationResponse {
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

// 알림 목록 DTO
export interface NotificationList {
  notifications: NotificationResponse[];
  totalCount: number;
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// 알림 생성 DTO
export interface CreateNotificationRequest {
  userId: number;
  notificationType: NotificationType;
  notificationTitle: string;
  notificationContent: string;
  notificationLink?: string;
  notificationPriority?: NotificationPriority;
  notificationScheduledAt?: string;
  notificationData?: any;
}

// 알림 수정 DTO
export interface UpdateNotificationRequest {
  notificationTitle?: string;
  notificationContent?: string;
  notificationLink?: string;
  notificationPriority?: NotificationPriority;
  notificationScheduledAt?: string;
  notificationData?: any;
}

// 알림 통계
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

// 알림 필터 옵션
export interface NotificationFilterOptions {
  page?: number;
  pageSize?: number;
  status?: NotificationStatus;
  type?: NotificationType;
}

// 읽지 않은 알림 개수 응답
export interface UnreadCountResponse {
  unreadCount: number;
}
