/**
 * 민감한 정보를 마스킹하는 유틸리티 함수들
 */

/**
 * 이메일 주소를 마스킹합니다
 * @param email - 마스킹할 이메일 주소
 * @returns 마스킹된 이메일 주소 (예: t*****@daum.net)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;

  const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * 전화번호를 마스킹합니다
 * @param phoneNumber - 마스킹할 전화번호
 * @returns 마스킹된 전화번호 (예: 010-****-7429)
 */
export function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return phoneNumber;

  // 010-1234-5678 형식인 경우
  if (phoneNumber.includes('-') && phoneNumber.length === 13) {
    const parts = phoneNumber.split('-');
    return `${parts[0]}-****-${parts[2]}`;
  }

  // 01012345678 형식인 경우
  if (phoneNumber.length === 11) {
    return `${phoneNumber.slice(0, 3)}-****-${phoneNumber.slice(7)}`;
  }

  return phoneNumber;
}

/**
 * 생년월일을 마스킹합니다
 * @param birth - 마스킹할 생년월일 (YYYY.MM.DD 형식)
 * @returns 마스킹된 생년월일 (예: 1995.**.13)
 */
export function maskBirth(birth: string): string {
  if (!birth) return birth;

  // YYYY.MM.DD 형식인 경우
  if (birth.includes('.') && birth.length === 10) {
    const parts = birth.split('.');
    return `${parts[0]}.**.${parts[2]}`;
  }

  return birth;
}

/**
 * 사용자 프로필 정보에서 민감한 정보를 마스킹합니다
 * @param profileInfo - 마스킹할 프로필 정보
 * @returns 민감한 정보가 마스킹된 프로필 정보
 */
export function maskSensitiveProfileInfo(profileInfo: any): any {
  if (!profileInfo) return profileInfo;

  return {
    ...profileInfo,
    email: profileInfo.email ? maskEmail(profileInfo.email) : profileInfo.email,
    phoneNumber: profileInfo.phoneNumber
      ? maskPhoneNumber(profileInfo.phoneNumber)
      : profileInfo.phoneNumber,
    birth: profileInfo.birth ? maskBirth(profileInfo.birth) : profileInfo.birth,
  };
}

/**
 * 개발자 도구에서 민감한 정보를 숨기기 위한 함수
 * 프로필 정보를 콘솔에 출력할 때 사용
 * @param profileInfo - 마스킹할 프로필 정보
 */
export function logMaskedProfileInfo(profileInfo: any): void {
  const maskedInfo = maskSensitiveProfileInfo(profileInfo);
  console.log('프로필 정보 (민감한 정보 마스킹됨):', maskedInfo);
}
