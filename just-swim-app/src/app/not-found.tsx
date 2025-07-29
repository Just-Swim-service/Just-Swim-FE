'use client';

import { useRouter } from 'next/navigation';
import styles from './not-found.module.scss';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={handleGoBack} className={styles.backButton}>
            이전 페이지로
          </button>
          <button onClick={handleGoHome} className={styles.homeButton}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
