'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './pages.module.scss';
import { TEXT } from '@data';

export default function Start() {
  const param = useSearchParams();
  const router = useRouter();
  const handleRoute = () => {
    const userType = param.get('type');
    if (!userType) {
      return;
    }
    if (userType === 'instructor') {
      router.push(`/instructor`);
    } else {
      router.push(`/customer`);
    }
  };

  return (
    <>
      <div className={styles.start_header}>
        <div>
          <h3>{TEXT.SIGNUP_COMPLETE_PAGE.notification}</h3>
        </div>
      </div>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.start_section}>
        <div>
          <div className={styles.type_button_img}>
            <div>
              <h3>{param.get('type')}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.start_footer}>
        <div className={styles.button_wrapper}>
          <button className={styles.select_button} onClick={handleRoute}>
            {TEXT.COMMON.start}
          </button>
        </div>
      </div>
    </>
  );
}
