import { MouseEvent } from "react";
import { ModalBodyProps } from "@types";

import styled from './styles.module.scss';

export function ModalBody({
  children,
  hideModal
}: ModalBodyProps) {
  const preventDefault = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  return (
    <div className={styled.modal_wrapper} onClick={preventDefault}>
      <div className={styled.modal}>
        <button
          className={styled.modal_top_btn}
          onClick={hideModal}>
          <div />
        </button>
        {children}
      </div>
    </div>
  )
}