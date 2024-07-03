import Link from 'next/link';

import styles from './styles.module.scss';

export function SelectTypeFooter({ type }: { type: string }) {
  return (
    <>
      <div className={styles.select_type_footer}>
        <div className={`${styles.button_wrapper} ${styles[type ? 'active' : '']}`}>
          <Link
            href={{
              pathname: `/login/profile`,
              query: { type: `${type}` },
            }}>
            <button className={styles.select_button}>선택</button>
          </Link>
        </div>
      </div>
    </>
  );
}
