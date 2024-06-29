import { MouseEvent } from "react";

import styled from './styles.module.scss';

export function ModalBody({
  children,
  hideModal
}: {
  children?: React.ReactNode,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
}) {
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