import styles from './styles.module.scss';

export function SelectTypeHeader() {
  return (
    <>
      <div className={styles.select_type_header}>
        <div>
          <h3>
            원활한 서비스 이용을 위해
            <br />
            회원 타입을 선택해주세요
          </h3>
        </div>
        <div>
          <p>이후 회원타입 변경이 불가능합니다.</p>
        </div>
      </div>
    </>
  );
}
