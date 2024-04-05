import styles from './_component/onBoarding/OnBoarding.module.css';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}