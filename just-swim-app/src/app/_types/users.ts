import { SNS, USER_TYPE } from '@data';

export type Provider = (typeof SNS)[keyof typeof SNS];
export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export interface UserEntity {
  userId: string;
  userType: UserType;
  provider: Provider;
  email: string;
  name: string;
  profileImage: string;
  birth: string;
  phoneNumber: string;
  userCreatedAt: string;
  userUpdatedAt: string;
  userDeletedAt: string;
  // 관계 데이터
  instructor?: Array<{
    workingLocation?: string;
    career?: string;
    history?: string;
    introduction?: string;
    curriculum?: string;
    youtubeLink?: string;
    instagramLink?: string;
    facebookLink?: string;
  }>;
  customer?: Array<{
    customerNickname?: string;
  }>;
}

export interface PostUserLoginReq
  extends Pick<UserEntity, 'email' | 'provider'> {}

export interface PostUserTypeReq extends Pick<UserEntity, 'userType'> {}

export interface PatchUserProfileReq
  extends Pick<UserEntity, 'name' | 'profileImage' | 'birth' | 'phoneNumber'> {}

export interface GetUserProfileRes {
  status: number;
  data: {
    success: boolean;
    message: string;
    data: UserEntity;
  };
}

export interface PostUserTypeReq {
  userType: UserType;
}

export interface PatchUserEditReq {
  profileImage: string;
  name: string;
  birth: string;
  phoneNumber: string;
  // Instructor 관련 필드
  instructorWorkingLocation?: string | null;
  instructorCareer?: string | null;
  instructorHistory?: string | null;
  instructorIntroduction?: string | null;
  instructorCurriculum?: string | null;
  instructorYoutubeLink?: string | null;
  instructorInstagramLink?: string | null;
  instructorFacebookLink?: string | null;
  // Customer 관련 필드
  customerNickname?: string | null;
}

export interface DeleteUserReq {
  withdrawalReasonContent: string;
}
