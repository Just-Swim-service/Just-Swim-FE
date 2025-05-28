'use client';

import styles from './styles.module.scss';

export function FullPageLoader() {
  return (
    <div className={styles.loader_wrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
}
