import styled from './qr.module.scss';

export default function QrHeader() {
  return (
    <>
      <div className={styled.qr_header}>
        <h3>
          수업 등록이 완료되었습니다.
          <br />
          생성된 QR을 수강생에게 전달해주세요!
        </h3>
      </div>
    </>
  );
}
