'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCustomerDashboardClient,
  type StudentDashboard,
  type FeedbackStats,
  type LectureStats,
  type CommunityActivity,
  type LevelInfo,
  type BadgeInfo,
} from '@apis';
import { Header, BottomNav } from '@components';
import {
  FeedbackChart,
  LevelProgress,
  BadgeList,
  StatsCard,
  ActivityChart,
} from '../_components';
import { DashboardSkeleton } from '../_components/dashboardSkeleton';
import { useUserStore } from '@store';

import styles from './styles.module.scss';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { profileInfo, loadProfileInfo, isLoading: profileLoading } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    checkUserTypeAndRedirect();
  }, [profileInfo, profileLoading]);

  const checkUserTypeAndRedirect = async () => {
    // 프로필 정보가 없으면 로드
    if (!profileInfo && !profileLoading) {
      await loadProfileInfo();
      return;
    }

    // 프로필 정보가 로딩 중이면 대기
    if (profileLoading) {
      return;
    }

    // 사용자 타입이 instructor이면 instructor 대시보드로 리다이렉트
    if (profileInfo?.userType === 'instructor') {
      router.replace('/dashboard/instructor');
      return;
    }

    // customer 타입일 때만 대시보드 데이터 로드 (한 번만)
    if (profileInfo?.userType === 'customer') {
      if (!hasFetched) {
        setHasFetched(true);
        fetchDashboard();
      }
    } else if (!profileInfo?.userType) {
      // userType이 없으면 기본적으로 customer로 처리 (한 번만)
      if (!hasFetched) {
        setHasFetched(true);
        fetchDashboard();
      }
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomerDashboardClient();
      console.log('Customer Dashboard Response:', response);
      if (response.ok && response.data?.success) {
        setDashboard(response.data.data);
      } else {
        console.error('Customer Dashboard API Error:', response);
        setError(response.data?.message || '대시보드 정보를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      console.error('대시보드 조회 실패:', error);
      setError(error.message || '대시보드 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <>
        <Header title="내 성과" />
        <main className={styles.container}>
          <DashboardSkeleton />
        </main>
        <BottomNav />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="내 성과" />
        <main className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>오류가 발생했습니다</h2>
            <p className={styles.errorDescription}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => {
                setError(null);
                fetchDashboard();
              }}>
              다시 시도
            </button>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!dashboard) {
    return (
      <>
        <Header title="내 성과" />
        <main className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h2 className={styles.emptyTitle}>아직 활동 내역이 없어요</h2>
            <p className={styles.emptyDescription}>
              수영 강의를 등록하고 피드백을 받으면
              <br />
              나만의 성장 그래프를 확인할 수 있어요!
            </p>
            <div className={styles.emptyActions}>
              <button
                className={styles.primaryAction}
                onClick={() => router.push('/class')}
              >
                강의 둘러보기
              </button>
              <button
                className={styles.secondaryAction}
                onClick={() => router.push('/community')}
              >
                커뮤니티 참여하기
              </button>
            </div>
            <div className={styles.emptyTips}>
              <h3>💡 이렇게 시작해보세요</h3>
              <ul>
                <li>🏊 강의에 등록하면 <strong>50 exp</strong> 획득</li>
                <li>📝 피드백을 받으면 <strong>10 exp</strong> 획득</li>
                <li>✍️ 커뮤니티에 글 작성하면 <strong>5 exp</strong> 획득</li>
                <li>🎓 첫 강의 등록 시 <strong>배지</strong> 획득</li>
              </ul>
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const {
    feedbackStats,
    lectureStats,
    communityActivity,
    levelInfo,
    badges,
  } = dashboard;

  return (
    <>
      <Header title="내 성과" />
      <main className={styles.container}>
        {/* 레벨 & 스트릭 섹션 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>레벨 & 활동</h2>
          <LevelProgress levelInfo={levelInfo} />
        </section>

        {/* 배지 섹션 */}
        {badges.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              획득한 배지 ({badges.length})
            </h2>
            <BadgeList badges={badges} />
          </section>
        )}

        {/* 주요 통계 카드 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>요약</h2>
          <div className={styles.statsGrid}>
            <StatsCard
              title="받은 피드백"
              value={feedbackStats.totalFeedbacks}
              subtitle={`최근 30일: ${feedbackStats.recentFeedbacks}회`}
              icon="📝"
            />
            <StatsCard
              title="수강 중인 강의"
              value={lectureStats.activeLectures}
              subtitle={`총 ${lectureStats.totalLectures}개 수강`}
              icon="📚"
            />
            <StatsCard
              title="커뮤니티 활동"
              value={communityActivity.totalPosts}
              subtitle={`댓글 ${communityActivity.totalComments}개`}
              icon="💬"
            />
            <StatsCard
              title="받은 좋아요"
              value={communityActivity.totalLikes}
              subtitle={`북마크 ${communityActivity.totalBookmarks}개`}
              icon="❤️"
            />
          </div>
        </section>

        {/* 피드백 통계 차트 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>피드백 추이</h2>
          <FeedbackChart data={feedbackStats.monthlyStats} />
          <div className={styles.feedbackTypes}>
            <div className={styles.feedbackType}>
              <span className={styles.label}>개인 피드백</span>
              <span className={styles.value}>
                {feedbackStats.personalFeedbacks}회
              </span>
            </div>
            <div className={styles.feedbackType}>
              <span className={styles.label}>그룹 피드백</span>
              <span className={styles.value}>
                {feedbackStats.groupFeedbacks}회
              </span>
            </div>
          </div>
        </section>

        {/* 수강 정보 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>수강 정보</h2>
          <div className={styles.lectureInfo}>
            <p>
              수강 시작일:{' '}
              {lectureStats.firstLectureDate || '정보 없음'}
            </p>
            <p>총 수강 기간: {lectureStats.totalDays}일</p>
          </div>
          <div className={styles.lectureList}>
            {lectureStats.lectures.map((lecture) => (
              <div
                key={lecture.lectureId}
                className={styles.lectureItem}
                onClick={() =>
                  router.push(`/class/detail/${lecture.lectureId}`)
                }
              >
                <div className={styles.lectureTitle}>
                  {lecture.lectureTitle}
                  {lecture.isActive && (
                    <span className={styles.activeBadge}>진행중</span>
                  )}
                </div>
                <div className={styles.lectureInfo}>
                  강사: {lecture.instructorName} | 시작일:{' '}
                  {lecture.startDate}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 커뮤니티 활동 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>커뮤니티 활동</h2>
          <ActivityChart data={communityActivity.postsByCategory} />
          {communityActivity.workoutStats && (
            <div className={styles.workoutStats}>
              <h3>운동 기록</h3>
              <p>
                총 운동 횟수: {communityActivity.workoutStats.totalWorkouts}회
              </p>
              {communityActivity.workoutStats.totalDistance && (
                <p>
                  총 거리:{' '}
                  {communityActivity.workoutStats.totalDistance.toFixed(1)}m
                </p>
              )}
              {communityActivity.workoutStats.totalDuration && (
                <p>
                  총 운동 시간:{' '}
                  {Math.floor(
                    communityActivity.workoutStats.totalDuration / 60,
                  )}
                  분
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}

