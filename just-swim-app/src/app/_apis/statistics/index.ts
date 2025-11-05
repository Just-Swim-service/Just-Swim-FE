import api from '../api';

const BASE_URL = '/statistics';

// API 응답 타입
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// 수강생 대시보드
export async function getCustomerDashboard() {
  const response = await api<ApiResponse<StudentDashboard>>(
    `${BASE_URL}/customer/dashboard`,
    'GET',
  );
  return response;
}

// 강사 대시보드
export async function getInstructorDashboard() {
  const response = await api<ApiResponse<InstructorDashboard>>(
    `${BASE_URL}/instructor/dashboard`,
    'GET',
  );
  return response;
}

// 랭킹 조회
export async function getRankings(type?: string, period?: number) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (period) params.append('period', period.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/rankings?${queryString}`
    : `${BASE_URL}/rankings`;

  const response = await api<ApiResponse<RankingResponse>>(url, 'GET');
  return response;
}

// 내 레벨 정보
export async function getMyLevel() {
  const response = await api<ApiResponse<LevelInfo>>(
    `${BASE_URL}/my-level`,
    'GET',
  );
  return response;
}

// 내 배지 목록
export async function getMyBadges() {
  const response = await api<ApiResponse<BadgeInfo[]>>(
    `${BASE_URL}/my-badges`,
    'GET',
  );
  return response;
}

// Types
export interface FeedbackStats {
  totalFeedbacks: number;
  personalFeedbacks: number;
  groupFeedbacks: number;
  recentFeedbacks: number;
  monthlyStats: { month: string; count: number }[];
}

export interface LectureStats {
  activeLectures: number;
  totalLectures: number;
  firstLectureDate: string;
  totalDays: number;
  lectures: {
    lectureId: number;
    lectureTitle: string;
    instructorName: string;
    startDate: string;
    isActive: boolean;
  }[];
}

export interface CommunityActivity {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalBookmarks: number;
  postsByCategory: { category: string; count: number }[];
  workoutStats?: {
    totalWorkouts: number;
    totalDistance?: number;
    totalDuration?: number;
  };
}

export interface LevelInfo {
  currentLevel: number;
  currentExp: number;
  expToNextLevel: number;
  progress: number;
  currentStreak: number;
  longestStreak: number;
  levelName: string;
}

export interface BadgeInfo {
  badgeType: string;
  badgeName: string;
  badgeDescription: string;
  earnedAt: string;
}

export interface StudentDashboard {
  feedbackStats: FeedbackStats;
  lectureStats: LectureStats;
  communityActivity: CommunityActivity;
  levelInfo: LevelInfo;
  badges: BadgeInfo[];
}

export interface InstructorLectureStats {
  activeLectures: number;
  totalLectures: number;
  totalStudents: number;
  activeStudents: number;
  lectureDetails: {
    lectureId: number;
    lectureTitle: string;
    studentCount: number;
    createdAt: string;
    isActive: boolean;
  }[];
}

export interface InstructorFeedbackStats {
  totalFeedbacks: number;
  personalFeedbacks: number;
  groupFeedbacks: number;
  recentFeedbacks: number;
  monthlyStats: { month: string; count: number }[];
  averageMonthlyFeedbacks: number;
}

export interface InstructorCommunityStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  tipPosts: number;
  popularPosts: {
    communityId: number;
    title: string;
    likeCount: number;
    commentCount: number;
  }[];
}

export interface StudentPerformance {
  userId: number;
  name: string;
  nickname: string;
  profileImage: string;
  joinedDate: string;
  feedbackCount: number;
  lastFeedbackDate: string;
  lectureTitle: string;
}

export interface InstructorDashboard {
  lectureStats: InstructorLectureStats;
  feedbackStats: InstructorFeedbackStats;
  communityStats: InstructorCommunityStats;
  studentPerformance: StudentPerformance[];
}

export interface RankingUser {
  rank: number;
  userId: number;
  name: string;
  nickname: string;
  profileImage: string;
  level: number;
  score: number;
  details: {
    feedbackCount?: number;
    postCount?: number;
    commentCount?: number;
    likeCount?: number;
    studentCount?: number;
  };
}

export interface RankingResponse {
  rankingType: string;
  period: number;
  rankings: RankingUser[];
  myRanking?: RankingUser;
}
