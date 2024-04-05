import styles from './SelectType.module.css';
import Link from 'next/link';

export default function SelectTypeFooter({
  type,
  handleRoute,
}: {
  type: string;
  handleRoute: (type: string) => void;
}) {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button
            className={`${styles.SelectButton} ${type ? styles.isActive : styles.isNotActive}`}
            onClick={() => handleRoute(type)}>
            선택
          </button>
        </div>
      </div>
    </>
  );
}
