import api from '../api';
import {
  Notification,
  NotificationListResponse,
  NotificationListParams,
} from '@types';

// 알림 목록 조회
async function getNotifications(
  params?: NotificationListParams,
): Promise<NotificationListResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const url = `/notification${queryParams.toString() ? `?${queryParams}` : ''}`;

    // 서버 래퍼 타입 명시
    const response = await api<{
      success: boolean;
      message?: string;
      data: NotificationListResponse;
    }>(url, 'GET');

    // ★ 실제 페이로드 반환
    return response.data.data;
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    throw error;
  }
}

// 알림 상세 조회
async function getNotification(notificationId: number): Promise<Notification> {
  try {
    const response = await api<{
      success: boolean;
      message?: string;
      data: Notification;
    }>(`/notification/${notificationId}`, 'GET');

    // ★ 실제 페이로드 반환
    return response.data.data;
  } catch (error) {
    console.error('알림 상세 조회 실패:', error);
    throw error;
  }
}

// 알림 읽음 처리
async function markAsRead(notificationId: number): Promise<void> {
  try {
    await api(`/notification/${notificationId}/read`, 'PATCH');
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    throw error;
  }
}

// 모든 알림 읽음 처리
async function markAllAsRead(): Promise<void> {
  try {
    await api('/notification/read-all', 'PATCH');
  } catch (error) {
    console.error('모든 알림 읽음 처리 실패:', error);
    throw error;
  }
}

// 알림 삭제
async function deleteNotification(notificationId: number): Promise<void> {
  try {
    await api(`/notification/${notificationId}`, 'DELETE');
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    throw error;
  }
}

// 읽지 않은 알림 개수 조회
async function getUnreadCount(): Promise<{ unreadCount: number }> {
  console.log('🔔 [FE] getUnreadCount 호출됨');

  try {
    console.log('🔔 [FE] API 호출 시작: /notification/stats/unread-count');

    const response = await api<{
      success: boolean;
      message?: string;
      data: { unreadCount: number };
    }>('/notification/stats/unread-count', 'GET');

    console.log('🔔 [FE] API 응답 성공:', response);

    // ★ 실제 페이로드 반환
    return response.data.data;
  } catch (error) {
    console.error('🔔 [FE] 읽지 않은 알림 개수 조회 실패:', error);
    throw error;
  }
}

export const notificationApi = {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
