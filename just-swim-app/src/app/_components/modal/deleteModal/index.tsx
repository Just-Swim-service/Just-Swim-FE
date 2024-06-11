// import './colorModal.scss';
import styled from './deleteModal.module.scss';

export function DeleteModal(props: any) {
  const { showModal, setShowModal } = props;

  return (
    <div className={styled.modal_background}>
      <div className={styled.modal}>
        <p>회원 탈퇴와 함께 계정이 삭제됩니다.</p>
        <p className={styled.description}>
          탈퇴와 즉시 등록된 개인 정보가 삭제되며,
          <br />한 번 삭제된 정보는 복구가 불가능 합니다.
        </p>
        <form action="#">
          <label>
            <input type="checkbox" />
            유의사항을 확인했습니다
          </label>
        </form>
        <div className={styled.modal_button}>
          <button onClick={() => setShowModal(false)}>취소</button>
          <button>확인</button>
        </div>
      </div>
    </div>
  );
}
