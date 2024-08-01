import styles from './layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={styles.before_login_container}>{children}</div>;
}
