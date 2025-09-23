/**
 * 개발자 도구에서 민감한 정보를 보호하는 유틸리티
 */

import { maskSensitiveProfileInfo } from './masking';

/**
 * 개발자 도구에서 프로필 정보를 안전하게 출력하는 함수
 * 민감한 정보는 자동으로 마스킹됩니다
 */
export function safeLogProfileInfo(
  profileInfo: any,
  label: string = '프로필 정보',
): void {
  if (process.env.NODE_ENV === 'development') {
    const maskedInfo = maskSensitiveProfileInfo(profileInfo);
    console.log(`${label} (민감한 정보 마스킹됨):`, maskedInfo);
  }
}

/**
 * 개발자 도구에서 로컬 스토리지의 user-store를 안전하게 출력하는 함수
 */
export function safeLogUserStore(userStore: any): void {
  if (process.env.NODE_ENV === 'development') {
    const maskedStore = {
      ...userStore,
      profileInfo: userStore.profileInfo
        ? maskSensitiveProfileInfo(userStore.profileInfo)
        : null,
    };
    console.log('User Store (민감한 정보 마스킹됨):', maskedStore);
  }
}

/**
 * 민감한 데이터를 마스킹하는 헬퍼 함수
 */
function maskSensitiveData(obj: any, sensitiveKeys: string[]): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (sensitiveKeys.includes(key)) {
      if (key === 'email' && typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/(.{1}).*(@.*)/, '$1****$2');
      } else if (key === 'phoneNumber' && typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
      } else if (key === 'birth' && typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/(\d{4})\.(\d{2})\.(\d{2})/, '$1.**.$3');
      } else if (key === 'refreshToken' || key === 'token') {
        obj[key] = '***마스킹됨***';
      }
    } else if (typeof obj[key] === 'object') {
      maskSensitiveData(obj[key], sensitiveKeys);
    }
  }
  return obj;
}

/**
 * 개발자 도구에서 민감한 정보가 포함된 객체를 안전하게 출력하는 범용 함수
 */
export function safeLog(data: any, label: string = '데이터'): void {
  if (process.env.NODE_ENV === 'development') {
    // 민감한 정보가 포함된 키들을 찾아서 마스킹
    const sensitiveKeys = [
      'email',
      'phoneNumber',
      'birth',
      'refreshToken',
      'token',
    ];
    const maskedData = JSON.parse(JSON.stringify(data)); // 깊은 복사

    const safeData = maskSensitiveData(maskedData, sensitiveKeys);
    console.log(`${label} (민감한 정보 마스킹됨):`, safeData);
  }
}
