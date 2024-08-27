import styled from './logoutModal.module.scss';

export function LogoutModal(props: any) {
  const { setShowModal, setUserLogout } = props;

  return (
    <div className={styled.modal_background}>
      <div className={styled.modal}>
        <div className={styled.first_modal}>
          <p className={styled.first_modal_title}>로그아웃 하시겠습니까?</p>
          <p className={styled.first_modal_content}>
            재로그인시 기존 SNS 간편 로그인을 <br /> 이용하시면 기록이
            연동됩니다.
          </p>
        </div>
        <div className={styled.second_modal}>
          <button onClick={() => setShowModal(false)}>취소</button>
          <button onClick={setUserLogout}>확인</button>
        </div>
      </div>
    </div>
  );
}
