import styles from './SelectType.module.css';
import Link from 'next/link';

export default function SelectTypeSection() {
  return (
    <>
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
    </>
  );
}
