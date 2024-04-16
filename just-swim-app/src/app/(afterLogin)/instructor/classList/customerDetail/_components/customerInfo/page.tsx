import styles from './customerInfo.module.css';

export default function CustomerInfo() {
  return (
    <div className={styles.customerInfo}>
      <p className={styles.name}>홍길동</p>
      <p className={styles.birthday}>1998년 11월 11일</p>
      <p className={styles.email}>11223344abcd@gmail.com</p>
      <p className={styles.phone}>등록된 번호가 없습니다.</p>
    </div>
  );
}
