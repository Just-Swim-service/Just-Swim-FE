import styles from './start.module.css';

export default function StartFooter() {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button className={styles.SelectButton}>시작하기</button>
        </div>
      </div>
    </>
  );
}
