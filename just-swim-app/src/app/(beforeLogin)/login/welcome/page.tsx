'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Welcome() {
  const router = useRouter();
  const type = '';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>환영합니다.</h3>
        </div>
      </div>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div>
          <div className={styles.TypeButtonImg}>
            <div></div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button className={styles.SelectButton}>시작하기</button>
        </div>
      </div>
    </div>
  );
}
