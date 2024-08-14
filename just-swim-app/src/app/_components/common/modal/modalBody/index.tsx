'use client';

import { MouseEvent, TouchEvent, useRef, useState } from "react";

import { usePreventScroll } from "@hooks";
import { ModalBodyProps } from "@types";

import styled from './styles.module.scss';
import Portal from "@/_components/layout/portal";

export function ModalBody({
  children,
  hideModal
}: ModalBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startCursorPosition = useRef<number>(0);
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);
  
  usePreventScroll();

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    startCursorPosition.current = event.targetTouches[0].pageY;
  };

  const handleTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    if (event.targetTouches[0].pageY - startCursorPosition.current <= 0) {
      return;
    }

    setMovingCursorPosition(event.targetTouches[0].pageY - startCursorPosition.current);
  };
  
  const handleTouchEnd = () => {
    if (movingCursorPositon > 150 && containerRef.current) {
      containerRef.current.dispatchEvent(new Event('click', { bubbles: true }));
    }

    setMovingCursorPosition(0);
  };

  const prevent = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Portal>
      <div className={styled.modal_wrapper} ref={containerRef} onClick={hideModal}>
        <div 
          className={styled.modal}
          style={{
            transform: `translateY(${movingCursorPositon}px)`
          }}
          onClick={prevent}
        >
          <button
            className={styled.modal_top_btn}
            onClick={hideModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div />
          </button>
          {children}
        </div>
      </div>
    </Portal>
  )
}