'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getStudentDashboard,
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

import styles from './styles.module.scss';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getStudentDashboard();
      if (response.ok) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error('대시보드 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="내 성과" />
        <main className={styles.container}>
          <div className={styles.loading}>로딩중...</div>
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
          <div className={styles.error}>데이터를 불러올 수 없습니다.</div>
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

