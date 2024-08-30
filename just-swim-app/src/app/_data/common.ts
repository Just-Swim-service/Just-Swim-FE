import { TEXT } from './text';

export const JUST_SWIM = 'Just Swim' as const;

export const USER_TYPE = {
  INSTRUCTOR: 'instructor',
  CUSTOMER: 'customer',
} as const;

export const SNS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
  NAVER: 'naver',
} as const;

export const OnBoardingType = {
  SIGNIN: 'Sign In',
  SIGNUP: 'Sign Up',
} as const;

export const DELETION_REASON = {
  NO_MORE_USE: {
    name: 'NO_MORE_USE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.noMoreUse,
  },
  NOT_USEFUL: {
    name: 'NOT_USEFUL',
    text: TEXT.ACCOUNT_PAGE.deletionReason.notUseful,
  },
  ERROR: {
    name: 'ERROR',
    text: TEXT.ACCOUNT_PAGE.deletionReason.error,
  },
  PRIVACE: {
    name: 'PRIVACE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.privacy,
  },
  OTHER_SERVICE: {
    name: 'OTHER_SERVICE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.otherService,
  },
  ETC: {
    name: 'ETC',
    text: TEXT.ACCOUNT_PAGE.deletionReason.etc,
  },
};
