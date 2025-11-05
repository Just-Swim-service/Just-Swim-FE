'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getInstructorDashboard,
  type InstructorDashboard,
} from '@apis';
import { Header, BottomNav } from '@components';
import { StatsCard, FeedbackChart } from '../_components';

import styles from './styles.module.scss';

export default function InstructorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<InstructorDashboard | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getInstructorDashboard();
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
        <Header title="강사 통계" />
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
        <Header title="강사 통계" />
        <main className={styles.container}>
          <div className={styles.error}>데이터를 불러올 수 없습니다.</div>
        </main>
        <BottomNav />
      </>
    );
  }

  const { lectureStats, feedbackStats, communityStats, studentPerformance } =
    dashboard;

  return (
    <>
      <Header title="강사 통계" />
      <main className={styles.container}>
        {/* 주요 통계 카드 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>전체 통계</h2>
          <div className={styles.statsGrid}>
            <StatsCard
              title="진행 중인 강의"
              value={lectureStats.activeLectures}
              subtitle={`총 ${lectureStats.totalLectures}개 강의`}
              icon="📚"
            />
            <StatsCard
              title="전체 수강생"
              value={lectureStats.totalStudents}
              subtitle={`활성 ${lectureStats.activeStudents}명`}
              icon="👥"
            />
            <StatsCard
              title="제공한 피드백"
              value={feedbackStats.totalFeedbacks}
              subtitle={`최근 30일: ${feedbackStats.recentFeedbacks}회`}
              icon="📝"
            />
            <StatsCard
              title="커뮤니티 좋아요"
              value={communityStats.totalLikes}
              subtitle={`게시글 ${communityStats.totalPosts}개`}
              icon="❤️"
            />
          </div>
        </section>

        {/* 강의 목록 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>강의 목록</h2>
          <div className={styles.lectureList}>
            {lectureStats.lectureDetails.map((lecture) => (
              <div
                key={lecture.lectureId}
                className={styles.lectureItem}
                onClick={() => router.push(`/class/detail/${lecture.lectureId}`)}
              >
                <div className={styles.lectureHeader}>
                  <h3 className={styles.lectureTitle}>
                    {lecture.lectureTitle}
                  </h3>
                  {lecture.isActive && (
                    <span className={styles.activeBadge}>진행중</span>
                  )}
                </div>
                <div className={styles.lectureInfo}>
                  <span>수강생: {lecture.studentCount}명</span>
                  <span>시작일: {lecture.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 피드백 통계 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>피드백 제공 추이</h2>
          <FeedbackChart data={feedbackStats.monthlyStats} />
          <div className={styles.feedbackStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>개인 피드백</span>
              <span className={styles.statValue}>
                {feedbackStats.personalFeedbacks}회
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>그룹 피드백</span>
              <span className={styles.statValue}>
                {feedbackStats.groupFeedbacks}회
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>월평균</span>
              <span className={styles.statValue}>
                {feedbackStats.averageMonthlyFeedbacks}회
              </span>
            </div>
          </div>
        </section>

        {/* 수강생 성과 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>수강생 성과 현황</h2>
          <div className={styles.studentList}>
            {studentPerformance.map((student) => (
              <div key={student.userId} className={styles.studentItem}>
                <div className={styles.studentAvatar}>
                  {student.profileImage ? (
                    <img src={student.profileImage} alt={student.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.studentInfo}>
                  <div className={styles.studentName}>
                    {student.name}
                    {student.nickname && (
                      <span className={styles.nickname}>({student.nickname})</span>
                    )}
                  </div>
                  <div className={styles.studentDetails}>
                    <span className={styles.lecture}>{student.lectureTitle}</span>
                    <span className={styles.divider}>|</span>
                    <span>피드백 {student.feedbackCount}회</span>
                  </div>
                  <div className={styles.studentMeta}>
                    <span>가입일: {student.joinedDate}</span>
                    {student.lastFeedbackDate && (
                      <span>최근 피드백: {student.lastFeedbackDate}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 커뮤니티 활동 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>커뮤니티 활동</h2>
          <div className={styles.communityStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>작성한 글</span>
              <span className={styles.statValue}>{communityStats.totalPosts}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>받은 댓글</span>
              <span className={styles.statValue}>
                {communityStats.totalComments}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>수영팁 글</span>
              <span className={styles.statValue}>{communityStats.tipPosts}</span>
            </div>
          </div>

          {communityStats.popularPosts.length > 0 && (
            <>
              <h3 className={styles.subTitle}>인기 게시글</h3>
              <div className={styles.popularPosts}>
                {communityStats.popularPosts.map((post) => (
                  <div
                    key={post.communityId}
                    className={styles.postItem}
                    onClick={() => router.push(`/community/${post.communityId}`)}
                  >
                    <h4 className={styles.postTitle}>{post.title}</h4>
                    <div className={styles.postStats}>
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}

