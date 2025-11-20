'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type StudentDashboard } from '@apis';
import { fetchJson } from '@utils';
import Cookies from 'js-cookie';
import { useUserStore } from '@store';
import styles from './styles.module.scss';

export function DashboardPreview() {
  const router = useRouter();
  const { profileInfo, loadProfileInfo, isLoading: profileLoading } = useUserStore();
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);

  useEffect(() => {
    checkUserTypeAndFetch();
  }, [profileInfo, profileLoading]);

  const checkUserTypeAndFetch = async () => {
    // 프로필 정보가 없으면 로드
    if (!profileInfo && !profileLoading) {
      await loadProfileInfo();
      return;
    }

    // 프로필 정보가 로딩 중이면 대기
    if (profileLoading) {
      return;
    }

    // customer 타입이 아니면 아무것도 표시하지 않음
    if (profileInfo?.userType !== 'customer') {
      return;
    }

    // customer 타입일 때만 대시보드 데이터 로드
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      const token = Cookies.get('authorization');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const data = await fetchJson<{
        success: boolean;
        message: string;
        data: StudentDashboard;
      }>('/statistics/customer/dashboard', {
        headers,
      });

      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.error('대시보드 미리보기 조회 실패:', error);
    }
  };

  // 프로필 정보가 로딩 중이거나 customer가 아니면 표시하지 않음
  if (profileLoading || profileInfo?.userType !== 'customer') {
    return null;
  }

  if (!dashboard) return null;

  const { feedbackStats, levelInfo, badges } = dashboard;

  // 최근 3개월 데이터만 표시
  const recentMonths = feedbackStats.monthlyStats.slice(-3);
  const maxCount = Math.max(...recentMonths.map((m) => m.count), 1);

  return (
    <div className={styles.container} onClick={() => router.push('/dashboard/customer')}>
      <div className={styles.header}>
        <h3 className={styles.title}>📊 나의 성장</h3>
        <span className={styles.viewAll}>자세히 보기 →</span>
      </div>

      {/* 레벨 카드 */}
      <div className={styles.levelCard}>
        <div className={styles.levelBadge}>
          <span className={styles.level}>Lv.{levelInfo.currentLevel}</span>
          <span className={styles.levelName}>{levelInfo.levelName}</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <div className={styles.expInfo}>
          <span>EXP {levelInfo.currentExp}/100</span>
          {levelInfo.currentStreak > 0 && (
            <span className={styles.streak}>🔥 {levelInfo.currentStreak}일 연속</span>
          )}
        </div>
      </div>

      {/* 성장 그래프 - 피드백 추이 */}
      {recentMonths.length > 0 && (
        <div className={styles.growthChart}>
          <h4>최근 피드백 추이</h4>
          <div className={styles.miniChart}>
            {recentMonths.map((item, index) => {
              const height = (item.count / maxCount) * 100;
              const monthLabel = item.month.split('-')[1] + '월';
              return (
                <div key={index} className={styles.barWrapper}>
                  <div className={styles.barContainer}>
                    <div className={styles.bar} style={{ height: `${height}%` }}>
                      <span className={styles.count}>{item.count}</span>
                    </div>
                  </div>
                  <span className={styles.label}>{monthLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 요약 통계 */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{feedbackStats.totalFeedbacks}</span>
            <span className={styles.statLabel}>총 피드백</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{badges.length}</span>
            <span className={styles.statLabel}>획득 배지</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{feedbackStats.recentFeedbacks}</span>
            <span className={styles.statLabel}>최근 30일</span>
          </div>
        </div>
      </div>

      {/* 최근 획득 배지 */}
      {badges.length > 0 && (
        <div className={styles.recentBadges}>
          <h4>🎖️ 최근 획득 배지</h4>
          <div className={styles.badgeList}>
            {badges.slice(0, 2).map((badge, index) => (
              <div key={index} className={styles.badgeItem}>
                <span className={styles.badgeIcon}>
                  {badge.badgeName.split(' ')[0]}
                </span>
                <div className={styles.badgeInfo}>
                  <span className={styles.badgeName}>{badge.badgeName}</span>
                  <span className={styles.badgeDate}>
                    {new Date(badge.earnedAt).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

