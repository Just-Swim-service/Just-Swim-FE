'use client';

import React, { useState } from 'react';
import {
  SkipLink,
  FocusTrap,
  Announcer,
  AccessibleButton,
  AccessibleModal,
  KeyboardNavigation,
  KeyboardShortcuts,
  KeyboardTrap,
} from '@components';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

export function AccessibilityExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [buttonStates, setButtonStates] = useState({
    primary: false,
    secondary: false,
    outline: false,
    ghost: false,
  });

  const { announce, isKeyboardUser, reducedMotion } = useAccessibility();

  const handleButtonClick = (buttonType: keyof typeof buttonStates) => {
    setButtonStates((prev) => ({
      ...prev,
      [buttonType]: !prev[buttonType],
    }));

    const message = `${buttonType} 버튼이 ${buttonStates[buttonType] ? '비활성화' : '활성화'}되었습니다.`;
    setAnnouncement(message);
    announce(message);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const shortcuts = {
    'Ctrl+k': () => {
      setAnnouncement('키보드 단축키 Ctrl+K가 실행되었습니다.');
      announce('키보드 단축키 Ctrl+K가 실행되었습니다.');
    },
    'Ctrl+Enter': () => {
      setAnnouncement('키보드 단축키 Ctrl+Enter가 실행되었습니다.');
      announce('키보드 단축키 Ctrl+Enter가 실행되었습니다.');
    },
  };

  return (
    <div className={styles.container}>
      <SkipLink href="#main-content">메인 콘텐츠로 건너뛰기</SkipLink>

      <header className={styles.header}>
        <h1>접근성 및 사용성 테스트</h1>
        <div className={styles.status}>
          <p>키보드 사용자: {isKeyboardUser ? '예' : '아니오'}</p>
          <p>애니메이션 감소: {reducedMotion ? '예' : '아니오'}</p>
        </div>
      </header>

      <main id="main-content" className={styles.main}>
        <section className={styles.section}>
          <h2>접근성 버튼</h2>
          <div className={styles.buttonGroup}>
            <AccessibleButton
              variant="primary"
              onClick={() => handleButtonClick('primary')}
              loading={buttonStates.primary}
              loadingText="로딩 중...">
              Primary Button
            </AccessibleButton>

            <AccessibleButton
              variant="secondary"
              onClick={() => handleButtonClick('secondary')}
              disabled={buttonStates.secondary}>
              Secondary Button
            </AccessibleButton>

            <AccessibleButton
              variant="outline"
              onClick={() => handleButtonClick('outline')}>
              Outline Button
            </AccessibleButton>

            <AccessibleButton
              variant="ghost"
              onClick={() => handleButtonClick('ghost')}>
              Ghost Button
            </AccessibleButton>
          </div>
        </section>

        <section className={styles.section}>
          <h2>키보드 네비게이션</h2>
          <KeyboardNavigation direction="horizontal" loop={true}>
            <div className={styles.navigationGroup}>
              <AccessibleButton variant="outline">첫 번째</AccessibleButton>
              <AccessibleButton variant="outline">두 번째</AccessibleButton>
              <AccessibleButton variant="outline">세 번째</AccessibleButton>
              <AccessibleButton variant="outline">네 번째</AccessibleButton>
            </div>
          </KeyboardNavigation>

          <p className={styles.instruction}>
            화살표 키로 버튼 간 이동이 가능합니다. (← →)
          </p>
        </section>

        <section className={styles.section}>
          <h2>포커스 트랩</h2>
          <FocusTrap isActive={true}>
            <div className={styles.trapContainer}>
              <h3>포커스가 이 영역에 갇혀있습니다</h3>
              <AccessibleButton variant="primary">버튼 1</AccessibleButton>
              <AccessibleButton variant="secondary">버튼 2</AccessibleButton>
              <AccessibleButton variant="outline">버튼 3</AccessibleButton>
            </div>
          </FocusTrap>
        </section>

        <section className={styles.section}>
          <h2>모달 테스트</h2>
          <AccessibleButton variant="primary" onClick={handleModalOpen}>
            모달 열기
          </AccessibleButton>
        </section>

        <section className={styles.section}>
          <h2>키보드 단축키</h2>
          <div className={styles.shortcutList}>
            <p>
              <kbd>Ctrl</kbd> + <kbd>K</kbd>: 테스트 단축키 1
            </p>
            <p>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd>: 테스트 단축키 2
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>스크린 리더 알림</h2>
          <div className={styles.announcementArea}>
            <p>현재 알림: {announcement || '없음'}</p>
            <AccessibleButton
              variant="outline"
              onClick={() => {
                const message = '새로운 알림이 발생했습니다.';
                setAnnouncement(message);
                announce(message);
              }}>
              알림 테스트
            </AccessibleButton>
          </div>
        </section>
      </main>

      <AccessibleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="접근성 모달 테스트"
        closeOnOverlayClick={true}
        closeOnEscape={true}>
        <div className={styles.modalContent}>
          <p>이 모달은 접근성 기능이 적용되어 있습니다.</p>
          <ul>
            <li>ESC 키로 닫기</li>
            <li>오버레이 클릭으로 닫기</li>
            <li>포커스 트랩</li>
            <li>스크린 리더 지원</li>
          </ul>
          <div className={styles.modalButtons}>
            <AccessibleButton variant="primary" onClick={handleModalClose}>
              확인
            </AccessibleButton>
            <AccessibleButton variant="outline" onClick={handleModalClose}>
              취소
            </AccessibleButton>
          </div>
        </div>
      </AccessibleModal>

      <KeyboardShortcuts shortcuts={shortcuts} />
    </div>
  );
}

