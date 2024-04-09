import { ReadonlyURLSearchParams } from 'next/navigation';
import styles from './start.module.css';

export default function StartFooter({ handleRoute }: { handleRoute: any }) {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button className={styles.SelectButton} onClick={handleRoute}>
            시작하기
          </button>
        </div>
      </div>
    </>
  );
}
