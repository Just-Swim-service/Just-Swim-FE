import styles from './profileSetting.module.scss';
import Link from 'next/link';

export default function ProfileSettingFooter({
  type,
}: {
  type: string | undefined;
}) {
  return (
    <>
      <div className={styles.profile_setting_footer}>
        <div className={styles.button_wrapper}>
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className={`${styles.select_button} ${styles.active}`}>
              다음
            </button>
          </Link>
        </div>
        <div className={styles.button_wrapper}>
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className={`${styles.select_button} ${styles.inactive}`}>
              건너뛰기
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
