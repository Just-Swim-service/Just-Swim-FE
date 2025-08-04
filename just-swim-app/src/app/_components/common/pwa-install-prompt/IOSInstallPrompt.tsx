'use client';

import { useState, useEffect } from 'react';
import styles from './IOSInstallPrompt.module.scss';

export const IOSInstallPrompt = () => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // 로컬 스토리지에서 iOS PWA 상태 확인
  const checkIOSPWAStatus = () => {
    const dismissed = localStorage.getItem('ios-pwa-dismissed');
    const accepted = localStorage.getItem('ios-pwa-accepted');

    // 30일 후에 거부 상태 초기화 (사용자가 다시 고려할 수 있도록)
    if (dismissed) {
      const dismissTime = parseInt(dismissed);
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissTime > thirtyDaysInMs) {
        localStorage.removeItem('ios-pwa-dismissed');
        return { dismissed: false, accepted: !!accepted };
      }
    }

    return { dismissed: !!dismissed, accepted: !!accepted };
  };

  // 설치 상태 모니터링
  const checkInstallationStatus = () => {
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;

    // PWA로 실행 중이 아니라면 이전에 설치했다고 기록된 상태를 초기화
    if (!isStandaloneMode) {
      const accepted = localStorage.getItem('ios-pwa-accepted');
      if (accepted) {
        // 설치했다고 기록되어 있지만 현재 PWA로 실행되지 않는다면 앱이 제거된 것으로 간주
        localStorage.removeItem('ios-pwa-accepted');
      }
    }

    setIsStandalone(isStandaloneMode);
  };

  useEffect(() => {
    // iOS 디바이스 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 초기 설치 상태 확인
    checkInstallationStatus();

    // iOS이고 PWA로 설치되지 않았다면 프롬프트 표시
    if (isIOSDevice && !isStandalone) {
      const { dismissed, accepted } = checkIOSPWAStatus();
      if (!dismissed && !accepted) {
        setShowIOSPrompt(true);
      }
    }

    // 페이지 포커스 시 설치 상태 재확인
    const handleFocus = () => {
      checkInstallationStatus();

      // 설치 상태가 변경되었을 수 있으므로 프롬프트 표시 여부 재확인
      if (isIOS && !isStandalone) {
        const { dismissed, accepted } = checkIOSPWAStatus();
        if (!dismissed && !accepted) {
          setShowIOSPrompt(true);
        } else {
          setShowIOSPrompt(false);
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isIOS, isStandalone]);

  const handleDismiss = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('ios-pwa-dismissed', Date.now().toString());
  };

  const handleInstall = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('ios-pwa-accepted', Date.now().toString());
  };

  if (!showIOSPrompt || !isIOS || isStandalone) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <div className={styles.content}>
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 21H5V3H13V9H19V21Z"
                fill="#007AFF"
              />
            </svg>
          </div>
          <h3>Just Swim 앱 설치</h3>
          <p>홈 화면에 앱을 추가하여 더 빠르게 접근하세요!</p>
          <div className={styles.instructions}>
            <p>설치 방법:</p>
            <ol>
              <li>
                하단의 <strong>공유</strong> 버튼을 탭하세요
              </li>
              <li>
                <strong>홈 화면에 추가</strong>를 선택하세요
              </li>
              <li>
                <strong>추가</strong>를 탭하세요
              </li>
            </ol>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={handleDismiss} className={styles.dismiss}>
            나중에
          </button>
          <button onClick={handleInstall} className={styles.install}>
            설치 방법 보기
          </button>
        </div>
      </div>
    </div>
  );
};
