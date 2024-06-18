type UserType = 'customer' | 'instructor';
type Provider = 'kakao' | 'naver' | 'google';

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
}

export interface PostUserLoginReq
  extends Pick<UserEntity, 'email' | 'provider'> {}

export interface PostUserTypeReq extends Pick<UserEntity, 'userType'> {}

export interface PatchUserProfileReq
  extends Pick<UserEntity, 'name' | 'profileImage' | 'birth' | 'phoneNumber'> {}

export interface GetUserProfileRes extends UserEntity {}
