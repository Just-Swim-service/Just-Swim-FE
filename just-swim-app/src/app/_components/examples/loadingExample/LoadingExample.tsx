'use client';

import React, { useState } from 'react';
import { useLoading } from '@hooks';
import {
  CardSkeleton,
  ListSkeleton,
  ProfileSkeleton,
  ButtonSkeleton,
} from '@components';
import { InlineLoader, ButtonLoader, Spinner } from '@components';
import styles from './styles.module.scss';

export function LoadingExample() {
  const { isLoading, withLoading, setLoading } = useLoading();
  const [showSkeletons, setShowSkeletons] = useState(false);

  const handleAsyncOperation = async () => {
    await withLoading(async () => {
      // 2초간 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  };

  const handleToggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
    if (!showSkeletons) {
      // 3초 후 스켈레톤 숨기기
      setTimeout(() => setShowSkeletons(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <h2>로딩 상태 및 스켈레톤 UI 테스트</h2>

      {/* 로딩 버튼 테스트 */}
      <section className={styles.section}>
        <h3>로딩 버튼</h3>
        <div className={styles.buttonGroup}>
          <ButtonLoader
            loading={isLoading}
            onClick={handleAsyncOperation}
            size="medium">
            비동기 작업 실행
          </ButtonLoader>

          <ButtonLoader
            loading={isLoading}
            onClick={() => setLoading(!isLoading)}
            size="small">
            로딩 토글
          </ButtonLoader>
        </div>
      </section>

      {/* 인라인 로더 테스트 */}
      <section className={styles.section}>
        <h3>인라인 로더</h3>
        <div className={styles.loaderGroup}>
          <InlineLoader size="small" text="작은 로더" />
          <InlineLoader size="medium" text="중간 로더" />
          <InlineLoader size="large" text="큰 로더" />
        </div>
      </section>

      {/* 스피너 테스트 */}
      <section className={styles.section}>
        <h3>스피너</h3>
        <div className={styles.spinnerGroup}>
          <Spinner size="small" color="#ef4444" />
          <Spinner size="medium" color="#10b981" />
          <Spinner size="large" color="#3b82f6" />
        </div>
      </section>

      {/* 스켈레톤 UI 테스트 */}
      <section className={styles.section}>
        <h3>스켈레톤 UI</h3>
        <button className={styles.toggleButton} onClick={handleToggleSkeletons}>
          {showSkeletons ? '스켈레톤 숨기기' : '스켈레톤 보기'}
        </button>

        {showSkeletons && (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonSection}>
              <h4>카드 스켈레톤</h4>
              <CardSkeleton count={2} showAvatar={true} showActions={true} />
            </div>

            <div className={styles.skeletonSection}>
              <h4>리스트 스켈레톤</h4>
              <ListSkeleton count={3} showHeader={true} showPagination={true} />
            </div>

            <div className={styles.skeletonSection}>
              <h4>프로필 스켈레톤</h4>
              <ProfileSkeleton
                size="medium"
                showStats={true}
                showActions={true}
              />
            </div>

            <div className={styles.skeletonSection}>
              <h4>버튼 스켈레톤</h4>
              <div className={styles.buttonSkeletonGroup}>
                <ButtonSkeleton count={3} size="small" variant="primary" />
                <ButtonSkeleton count={2} size="medium" variant="secondary" />
                <ButtonSkeleton count={1} size="large" variant="outline" />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

