import { ModalBody } from '@components';
import { LightConfirmModalProps } from '@types';

import styled from './styles.module.scss';

export function LightConfirmModal({
  title,
  hideModal,
  confirmCallback,
  children,
  confirmText = '확인',
  showCancel = true,
}: LightConfirmModalProps) {
  return (
    <ModalBody hideModal={hideModal}>
      <div className={styled.header_wrapper}>
        {showCancel ? <button onClick={hideModal}>취소</button> : <div />}
        <p>{title}</p>
        <button onClick={confirmCallback}>{confirmText}</button>
      </div>
      {children}
    </ModalBody>
  );
}
