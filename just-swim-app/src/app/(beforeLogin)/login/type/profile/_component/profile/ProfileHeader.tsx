import styles from '@/app/(beforeLogin)/Common.module.css';
import { useSearchParams } from 'next/navigation';

export default function ProfileHeader() {
  const params = useSearchParams().get('type');
  console.log(params);
  const type = params === 'instructor' ? '강사' : '수강생';

  return (
    <>
      <div className={styles.header}>
        <div>
          <h3>
            {type} 분들이 알아볼 수 있도록
            <br />
            프로필 이미지와 이름을 설정해주세요.
          </h3>
        </div>
        <div>
          <p>이후 언제든 변경 가능합니다.</p>
        </div>
      </div>
    </>
  );
}
