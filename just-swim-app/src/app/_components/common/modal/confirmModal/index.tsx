import { ConfirmButton, ModalBody } from "@components";
import { ConfirmModalProps } from "@types";

import styled from './styles.module.scss';

export function ConfirmModal({
  children,
  hideModal,
  confirmCallback
}: ConfirmModalProps) {
  return (
    <ModalBody hideModal={hideModal}>
      {children}
      <div className={styled.modal_btn}>
        <ConfirmButton text='취소' kind='confirm-sub' onClick={hideModal} />
        <ConfirmButton text='변경' kind='confirm' onClick={confirmCallback} />
      </div>
    </ModalBody>
  )
}