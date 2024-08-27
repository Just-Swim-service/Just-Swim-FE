import { TEXT } from '@data';
import styled from './logoutModal.module.scss';

export function LogoutModal(props: any) {
  const { setShowModal, setUserLogout } = props;

  return (
    <div className={styled.modal_background}>
      <div className={styled.modal}>
        <div className={styled.first_modal}>
          <p className={styled.first_modal_title}>
            {TEXT.ACCOUNT_PAGE.logoutTitle}
          </p>
          <p className={styled.first_modal_content}>
            {TEXT.ACCOUNT_PAGE.logoutContent.first} <br />
            {TEXT.ACCOUNT_PAGE.logoutContent.second}
          </p>
        </div>
        <div className={styled.second_modal}>
          <button onClick={() => setShowModal(false)}>
            {TEXT.COMMON.cancel}
          </button>
          <button onClick={setUserLogout}>{TEXT.COMMON.confirm}</button>
        </div>
      </div>
    </div>
  );
}
