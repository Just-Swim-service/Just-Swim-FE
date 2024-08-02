import { ModalBody } from "@components";
import { LightConfirmModalProps } from "@types";

import styled from './styles.module.scss';

export function LightConfirmModal({
  title,
  hideModal,
  confirmCallback,
  children,
}: LightConfirmModalProps) {
  return (
    <ModalBody hideModal={hideModal}>
      <div className={styled.header_wrapper}>
        <button>취소</button>
        <p>{title}</p>
        <button>완료</button>
      </div>
      {children}
    </ModalBody>
  )
}