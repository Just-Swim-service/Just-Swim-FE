import Link from 'next/link';

import styled from './styles.module.scss';

export function QrFooter() {
  return (
    <>
      <div className={styled.qr_footer}>
        <div className={styled.button_wrapper}>
          <Link
            href={{
              pathname: `/instructor`,
            }}>
            <button className={`${styled.select_button} ${styled.active}`}>
              홈 화면으로 돌아가기
            </button>
          </Link>
        </div>
        <div className={styled.button_wrapper}>
          <Link
            href={{
              pathname: `/instructor/register`,
            }}>
            <button className={styled.select_button}>정보 변경하기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
