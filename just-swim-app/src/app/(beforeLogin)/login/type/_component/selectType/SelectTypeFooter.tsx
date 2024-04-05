import styles from './SelectType.module.css';
import Link from 'next/link';

export default function SelectTypeFooter({ type }: { type: string }) {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          {/* type 값에 따라 styles 다른거 설정하기 */}
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: `${type}` },
            }}>
            <button
              className={`${styles.SelectButton} ${type ? styles.isActive : styles.isNotActive}`}>
              선택
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
