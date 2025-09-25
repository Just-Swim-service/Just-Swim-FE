export interface ProfileProps {
  provider: string;
  userType: string;
  email: string;
  name: string;
  profileImage: string;
  birth: string;
  phoneNumber: string;
}

export interface InstructorProfileProps {
  workingLocation?: string; // 근무지
  career?: string; // 경력
  history?: string; // 이력
  introduction?: string; // 강사 소개
  curriculum?: string; // 커리큘럼
  youtubeLink?: string; // 유튜브 링크
  instagramLink?: string; // 인스타그램 링크
  facebookLink?: string; // 페이스북 링크
}

export interface CustomerProfileProps {
  customerNickname?: string; // 고객 닉네임
}

// 통합 프로필 타입
export interface ExtendedProfileProps extends ProfileProps {
  instructorProfile?: InstructorProfileProps;
  customerProfile?: CustomerProfileProps;
}

// QR 코드에서 사용하는 강사 프로필 타입 (UserEntity 기반)
export interface QRInstructorProfileProps {
  name: string;
  profileImage: string;
  workingLocation?: string;
  career?: string;
  history?: string;
  introduction?: string;
  curriculum?: string;
  youtubeLink?: string;
  instagramLink?: string;
  facebookLink?: string;
}
