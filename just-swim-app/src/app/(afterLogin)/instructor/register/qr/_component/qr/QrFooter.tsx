import './qr.scss';
import Link from 'next/link';

export default function QrFooter() {
  return (
    <>
      <div className="qr_footer">
        <div className="button_wrapper">
          <Link
            href={{
              pathname: `/instructor`,
            }}>
            <button className="select_button active">
              홈 화면으로 돌아가기
            </button>
          </Link>
        </div>
        <div className="button_wrapper">
          <Link
            href={{
              pathname: `/instructor/register`,
            }}>
            <button className="select_button">정보 변경하기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
