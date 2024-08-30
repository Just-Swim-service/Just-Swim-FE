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

export const DELETION_REASON = [
  {
    name: 'NO_MORE_USE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.noMoreUse,
  },
  {
    name: 'NOT_USEFUL',
    text: TEXT.ACCOUNT_PAGE.deletionReason.notUseful,
  },
  {
    name: 'ERROR',
    text: TEXT.ACCOUNT_PAGE.deletionReason.error,
  },
  {
    name: 'PRIVACE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.privacy,
  },
  {
    name: 'OTHER_SERVICE',
    text: TEXT.ACCOUNT_PAGE.deletionReason.otherService,
  },
  {
    name: 'ETC',
    text: TEXT.ACCOUNT_PAGE.deletionReason.etc,
  },
] as const;
