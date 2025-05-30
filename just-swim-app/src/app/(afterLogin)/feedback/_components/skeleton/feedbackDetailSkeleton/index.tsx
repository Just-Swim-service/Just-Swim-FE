import styles from './feedbackDetail.module.scss';

export function FeedbackDetailSkeleton() {
  return (
    <div className={styles.detail_container}>
      <div className={styles.skeleton_text} />
      <div className={styles.skeleton_line} />
      <div className={styles.skeleton_line} />
      <div className={styles.skeleton_section} />
      <div className={styles.skeleton_text} />
      <div className={styles.skeleton_section} />
      <div className={styles.skeleton_text} />
      <div className={styles.skeleton_section} />
      <div className={styles.skeleton_text} />
      <div className={styles.skeleton_section} />
      <div className={styles.skeleton_photo_list}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className={styles.skeleton_photo} />
        ))}
      </div>
      <div className={styles.skeleton_text} />
      <div className={styles.skeleton_section} />
    </div>
  );
}
