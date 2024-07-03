import styles from './styles.module.scss';

export function SelectTypeSection({
  type,
  handleType,
}: {
  type: string;
  handleType: (type: string) => void;
}) {
  return (
    <>
      <div className={styles.select_type_section}>
        <div className={styles.type_button_wrapper}>
          <button
            className={`${styles.type_button} ${styles[type === 'instructor' ? 'active' : '']}`}
            // className={`type_button ${type === 'instructor' ? 'active' : ''}`}
            onClick={() => handleType('instructor')}>
            <div className={styles.type_button_img}>
              <div></div>
            </div>
            <div className={styles.type_button_info}>
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

        <div className={styles.type_button_wrapper}>
          <button
            className={`${styles.type_button} ${styles[type === 'customer' ? 'active' : '']}`}
            onClick={() => handleType('customer')}>
            <div className={styles.type_button_img}>
              <div></div>
            </div>
            <div className={styles.type_button_info}>
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
      </div>
    </>
  );
}
