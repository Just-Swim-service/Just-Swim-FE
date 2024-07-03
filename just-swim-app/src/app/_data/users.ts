export const SNS = {
  google: '구글',
  kakao: '카카오',
  naver: '네이버',
} as const;

const SIGNUP_TEXT = {
  welcome: '수영인들을 위한 소통 창구',
  notification: {
    first: '원활한 서비스 이용을 위해',
    second: '회원 가입 혹은 로그인을 진행해 주세요.',
  },
  helper: {
    first: 'Just Swim은 SNS 계정 연동을 통해서 회원가입 할 수 있습니다.',
    second: '이 과정에서 고객님의 데이터는 철저하게 보호됨을 알려드립니다.',
  },
} as const;

export const TEXT = {
  SIGNUP_PAGE: { ...SIGNUP_TEXT },
};
