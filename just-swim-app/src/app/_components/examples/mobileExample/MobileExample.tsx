'use client';

import React, { useState } from 'react';
import {
  SwipeContainer,
  SwipeItem,
  SwipeIndicator,
  ResponsiveContainer,
  MobileOnly,
  DesktopOnly,
  Breakpoint,
  MobileBottomNav,
  MobileDrawer,
  MobileHeader,
} from '@components';
import { useTouch } from '@hooks';
import styles from './styles.module.scss';

export function MobileExample() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');

  const { touchStart, touchMove, touchEnd } = useTouch({
    onSwipeLeft: () => setSwipeDirection('왼쪽으로 스와이프'),
    onSwipeRight: () => setSwipeDirection('오른쪽으로 스와이프'),
    onSwipeUp: () => setSwipeDirection('위로 스와이프'),
    onSwipeDown: () => setSwipeDirection('아래로 스와이프'),
    onTap: () => setSwipeDirection('탭'),
    onLongPress: () => setSwipeDirection('롱프레스'),
  });

  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: '🏠',
      href: '/',
      isActive: true,
    },
    {
      id: 'schedule',
      label: '일정',
      icon: '📅',
      href: '/schedule',
      isActive: false,
    },
    {
      id: 'feedback',
      label: '피드백',
      icon: '💬',
      href: '/feedback',
      isActive: false,
    },
    {
      id: 'account',
      label: '계정',
      icon: '👤',
      href: '/account',
      isActive: false,
    },
  ];

  const slides = [
    { id: 1, content: '슬라이드 1', color: '#ef4444' },
    { id: 2, content: '슬라이드 2', color: '#10b981' },
    { id: 3, content: '슬라이드 3', color: '#3b82f6' },
    { id: 4, content: '슬라이드 4', color: '#f59e0b' },
  ];

  return (
    <ResponsiveContainer className={styles.container}>
      <MobileHeader
        title="모바일 UX 테스트"
        showBackButton={true}
        onBackClick={() => console.log('뒤로가기')}
        rightIcon="⚙️"
        onRightClick={() => setIsDrawerOpen(true)}
      />

      <div className={styles.content}>
        <section className={styles.section}>
          <h3>터치 인터랙션 테스트</h3>
          <div
            className={styles.touchArea}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}>
            <p>이 영역을 터치해보세요</p>
            <p>방향: {swipeDirection || '대기 중...'}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h3>스와이프 컨테이너</h3>
          <SwipeContainer
            onSwipeLeft={() =>
              setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1))
            }
            onSwipeRight={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
            className={styles.swipeContainer}>
            <div
              className={styles.slide}
              style={{ backgroundColor: slides[currentSlide].color }}>
              <h4>{slides[currentSlide].content}</h4>
              <p>좌우로 스와이프하여 슬라이드를 변경하세요</p>
            </div>
          </SwipeContainer>
          <SwipeIndicator
            currentIndex={currentSlide}
            totalItems={slides.length}
            direction="horizontal"
          />
        </section>

        <section className={styles.section}>
          <h3>스와이프 아이템</h3>
          <div className={styles.swipeItems}>
            {[1, 2, 3].map((item) => (
              <SwipeItem
                key={item}
                onSwipeLeft={() => console.log(`아이템 ${item} 왼쪽 스와이프`)}
                onSwipeRight={() =>
                  console.log(`아이템 ${item} 오른쪽 스와이프`)
                }
                onTap={() => console.log(`아이템 ${item} 탭`)}
                className={styles.swipeItem}>
                <div className={styles.itemContent}>
                  <h4>아이템 {item}</h4>
                  <p>좌우로 스와이프하거나 탭하세요</p>
                </div>
              </SwipeItem>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>반응형 컴포넌트</h3>
          <MobileOnly>
            <div className={styles.mobileOnly}>
              <p>이 텍스트는 모바일에서만 보입니다</p>
            </div>
          </MobileOnly>

          <DesktopOnly>
            <div className={styles.desktopOnly}>
              <p>이 텍스트는 데스크톱에서만 보입니다</p>
            </div>
          </DesktopOnly>

          <Breakpoint min={768} max={1024}>
            <div className={styles.tabletOnly}>
              <p>이 텍스트는 태블릿에서만 보입니다</p>
            </div>
          </Breakpoint>
        </section>

        <section className={styles.section}>
          <h3>모바일 드로어</h3>
          <button
            className={styles.button}
            onClick={() => setIsDrawerOpen(true)}>
            드로어 열기
          </button>
        </section>
      </div>

      <MobileBottomNav
        items={navItems}
        onItemClick={(item) => console.log(`${item.label} 클릭`)}
      />

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="bottom"
        size="medium">
        <div className={styles.drawerContent}>
          <h3>설정</h3>
          <div className={styles.drawerItems}>
            <button className={styles.drawerItem}>프로필 설정</button>
            <button className={styles.drawerItem}>알림 설정</button>
            <button className={styles.drawerItem}>테마 설정</button>
            <button className={styles.drawerItem}>로그아웃</button>
          </div>
        </div>
      </MobileDrawer>
    </ResponsiveContainer>
  );
}

