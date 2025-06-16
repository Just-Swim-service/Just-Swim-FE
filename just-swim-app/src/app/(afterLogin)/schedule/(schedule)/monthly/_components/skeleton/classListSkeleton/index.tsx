import styles from './styles.module.scss';

export function ClassListSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={`${styles.date} ${styles.skeleton}`} />
      </div>
      <div className={styles.list_container}>
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={`${styles.card_skeleton} ${styles.skeleton_block}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
