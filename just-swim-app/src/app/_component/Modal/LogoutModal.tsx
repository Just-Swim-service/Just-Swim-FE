// import './colorModal.scss';
import styled from './logoutModal.module.scss';

export default function LogoutModal(props) {
  const { showModal, setShowModal } = props;

  return (
    <div className={styled.modal_background}>
      <div className={styled.modal}>
        <p>로그아웃 하시겠습니까?</p>
        <div>
          <button onClick={() => setShowModal(false)}>취소</button>
          <button>확인</button>
        </div>
      </div>
    </div>
  );
}
