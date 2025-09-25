export interface ProfileProps {
  provider: string;
  userType: string;
  email: string;
  name: string;
  profileImage: string;
  birth: string;
  phoneNumber: string;
}

// 강사 전용 프로필 정보
export interface InstructorProfileProps {
  name: string;
  image?: string;
  introduction?: string; // 강사 소개
  experience?: string; // 경력 (년수)
  specialties?: string[]; // 전문 분야
  certifications?: string[]; // 자격증
  availableTimes?: string[]; // 수업 가능 시간대
  rating?: number; // 평점
  totalStudents?: number; // 총 수강생 수
}

// 고객 전용 프로필 정보
export interface CustomerProfileProps {
  name: string;
  image?: string;
  swimmingLevel?: string; // 수영 실력 레벨
  preferredStyles?: string[]; // 선호하는 수영 스타일
  allergies?: string; // 알레르기/주의사항
  emergencyContact?: string; // 비상연락처
  totalClasses?: number; // 총 수강한 수업 수
  favoriteInstructors?: string[]; // 선호하는 강사들
}

// 통합 프로필 타입
export interface ExtendedProfileProps extends ProfileProps {
  instructorProfile?: InstructorProfileProps;
  customerProfile?: CustomerProfileProps;
}
