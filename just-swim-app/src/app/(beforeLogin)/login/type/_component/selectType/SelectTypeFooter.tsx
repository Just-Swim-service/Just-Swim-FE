import styles from './SelectType.module.css';

export default function SelectTypeFooter() {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button className={styles.SelectButton}>선택</button>
        </div>
      </div>
    </>
  );
}
