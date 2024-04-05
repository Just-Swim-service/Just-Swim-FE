import { ReadonlyURLSearchParams } from 'next/navigation';
import styles from './start.module.css';

export default function StartSection({
  param,
}: {
  param: ReadonlyURLSearchParams;
}) {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div>
          <div className={styles.TypeButtonImg}>
            <div>
              <h3>{param.get('type')}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
