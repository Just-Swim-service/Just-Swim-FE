import { ReadonlyURLSearchParams } from 'next/navigation';
import styles from './start.module.scss';

export default function StartFooter({
  handleRoute,
}: {
  handleRoute: () => void;
}) {
  return (
    <>
      <div className={styles.start_footer}>
        <div className={styles.button_wrapper}>
          <button className={styles.select_button} onClick={handleRoute}>
            시작하기
          </button>
        </div>
      </div>
    </>
  );
}
