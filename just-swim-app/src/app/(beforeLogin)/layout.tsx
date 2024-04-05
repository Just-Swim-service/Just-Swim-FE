import styles from './_component/onBoardingComponent/OnBoarding.module.css';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}