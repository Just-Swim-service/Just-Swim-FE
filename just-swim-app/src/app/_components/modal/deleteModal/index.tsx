import { TEXT } from '@data';
import styled from './deleteModal.module.scss';
import { useState } from 'react';

export function DeleteModal(props: any) {
  const { setShowModal, setUserDeletion } = props;
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styled.modal_background}>
      <div className={styled.modal}>
        <div className={styled.first_modal}>
          <p className={styled.first_modal_title}>
            회원 탈퇴와 함께 계정이 삭제됩니다.
          </p>
          <p className={styled.first_modal_content}>
            탈퇴와 즉시 등록된 개인 정보가 삭제되며,
            <br />한 번 삭제된 정보는 복구가 불가능 합니다.
          </p>
        </div>
        <div className={styled.second_modal}>
          <input type="checkbox" onClick={() => setIsActive(!isActive)} />
          <p>유의사항을 확인했습니다</p>
        </div>
        <div className={styled.third_modal}>
          <button onClick={() => setShowModal(false)}>
            {TEXT.COMMON.cancel}
          </button>
          <button
            className={`${isActive ? styled.active : ''}`}
            onClick={setUserDeletion}>
            {TEXT.COMMON.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
