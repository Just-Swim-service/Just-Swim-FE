import styles from './selectType.module.scss';
import Link from 'next/link';

export default function SelectTypeFooter({ type }: { type: string }) {
  return (
    <>
      <div className={styles.select_type_footer}>
        <div className={`${styles.button_wrapper} ${styles[type ? 'active' : '']}`}>
          <Link
            href={{
              pathname: `/login/type/profile`,
              query: { type: `${type}` },
            }}>
            <button className={styles.select_button}>선택</button>
          </Link>
        </div>
      </div>
    </>
  );
}
