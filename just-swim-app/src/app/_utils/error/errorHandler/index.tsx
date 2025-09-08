'use client';

import { useToast } from '@components';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다.',
  };
}

export function getErrorMessage(error: ApiError): string {
  const { message, status } = error;

  // HTTP 상태 코드별 사용자 친화적 메시지
  switch (status) {
    case 400:
      return '잘못된 요청입니다. 입력 정보를 확인해주세요.';
    case 401:
      return '로그인이 필요합니다. 다시 로그인해주세요.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 정보를 찾을 수 없습니다.';
    case 409:
      return '이미 존재하는 정보입니다.';
    case 422:
      return '입력한 정보가 올바르지 않습니다.';
    case 429:
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.';
    default:
      return message || '오류가 발생했습니다.';
  }
}

export function useErrorHandler() {
  const { showToast } = useToast();

  const handleError = (error: unknown, showNotification: boolean = true) => {
    const apiError = handleApiError(error);
    const userMessage = getErrorMessage(apiError);

    console.error('Error handled:', apiError);

    if (showNotification) {
      showToast(userMessage, 'error', 5000);
    }

    return apiError;
  };

  const handleSuccess = (message: string) => {
    showToast(message, 'success', 3000);
  };

  const handleWarning = (message: string) => {
    showToast(message, 'warning', 4000);
  };

  const handleInfo = (message: string) => {
    showToast(message, 'info', 3000);
  };

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
}

