'use client';

import { useState, useEffect } from 'react';
import styles from './IOSInstallPrompt.module.scss';

export const IOSInstallPrompt = () => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS 디바이스 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 이미 PWA로 설치되어 있는지 확인
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;
    setIsStandalone(isStandaloneMode);

    // iOS이고 PWA로 설치되지 않았다면 프롬프트 표시
    if (isIOSDevice && !isStandaloneMode) {
      // 로컬 스토리지에서 이전에 거부했는지 확인
      const dismissed = localStorage.getItem('ios-pwa-dismissed');
      if (!dismissed) {
        setShowIOSPrompt(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('ios-pwa-dismissed', 'true');
  };

  const handleInstall = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('ios-pwa-dismissed', 'true');
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
