export const ACCOUNT_TEXT = {
  editInfoTitle: '프로필 수정',
  editInfo: '프로필 수정하기',
  appSetting: '앱 설정',
  deletion: '탈퇴하기',
  logout: '로그아웃',
  myInfo: '내 정보',
  name: '이름',
} as const;

export const LOGOUT_TEXT = {
  logoutTitle: '로그아웃 하시겠습니까?',
  logoutContent: {
    first: '재로그인시 기존 SNS 간편 로그인을',
    second: '이용하시면 기록이 연동됩니다.',
  },
} as const;

export const DELETION_TEXT = {
  deletionTitle: '탈퇴하는 이유가 무엇인가요?',
  deletionContent: '더 나은 서비스가 될 수 있도록 의견을 들려주세요.',
  deletionReason: {
    noMoreUse: '더 이상 사용하지 않는 앱이에요.',
    notUseful: '기능이 유용하지 않아요.',
    error: '오류가 생겨서 쓸 수가 없어요.',
    privacy: '개인 정보 공개가 불안해요.',
    otherService: '다른 유사 서비스를 이용 중이에요.',
    etc: '기타',
  },
} as const;
