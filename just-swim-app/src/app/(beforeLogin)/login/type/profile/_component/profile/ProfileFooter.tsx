import styles from './Profile.module.css';
import Link from 'next/link';

export default function ProfileFooter({ type }: { type: string | undefined }) {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className={`${styles.SelectButton} ${styles.isActive}`}>
              다음
            </button>
          </Link>
        </div>
        <div className={styles.buttonWrapper}>
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className={`${styles.SelectButton} ${styles.isNotActive}`}>
              건너뛰기
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
