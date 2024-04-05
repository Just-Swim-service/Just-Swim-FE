'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const router = useRouter();
  const type = '';

  return (
    <>
      <div className={styles.header}>
        <div>
          <h3>
            원활한 서비스 이용을 위해
            <br />
            회원 타입을 선택해주세요.
          </h3>
        </div>
        <div>
          <p>이후 회원타입 변경이 불가능합니다.</p>
        </div>
      </div>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div>
          <Link
            href={{
              pathname: '/instructor',
              query: { type: 'instructor' },
            }}>
            <div className={styles.TypeButtonWrapper}>
              <button className={styles.TypeButton}>
                <div className={styles.TypeButtonImg}>
                  <div></div>
                </div>
                <div className={styles.TypeButtonInfo}>
                  <div>
                    <h3>수영 강사</h3>
                  </div>
                  <div>
                    <p>
                      수영 강습 이력을
                      <br />
                      보유하신 분
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Link>
        </div>

        <div>
          <Link
            href={{
              pathname: '/customer',
              query: { type: 'customer' },
            }}>
            <div className={styles.TypeButtonWrapper}>
              <button className={styles.TypeButton}>
                <div className={styles.TypeButtonImg}>
                  <div></div>
                </div>
                <div className={styles.TypeButtonInfo}>
                  <div>
                    <h3>수강생/보호자</h3>
                  </div>
                  <div>
                    <p>
                      수영 강습 수강생
                      <br />
                      혹은 보호자
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <button className={styles.SelectButton}>선택</button>
        </div>
      </div>
    </>
  );
}
