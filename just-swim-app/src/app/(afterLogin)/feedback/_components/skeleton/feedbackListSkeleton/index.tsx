import styles from './styles.module.scss';

export function FeedbackListSkeleton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.text}>
        <div className={`${styles.title} ${styles.skeleton}`} />
        <div className={styles.skeleton} />
      </div>
      <div className={styles.container}>
        <div className={styles.list}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className={styles.card_skeleton} />
          ))}
        </div>
        <div className={styles.page}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className={styles.page_button_skeleton} />
          ))}
        </div>
      </div>
    </div>
  );
}
