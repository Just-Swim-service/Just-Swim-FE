'use client';

import { MouseEvent, TouchEvent, useRef, useState } from "react";

import { usePreventScroll } from "@hooks";
import { ModalBodyProps } from "@types";
import { Portal } from "@components";

import styled from './styles.module.scss';

export function ModalBody({
  children,
  hideModal
}: ModalBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startCursorPosition = useRef<number>(0);
  const startDrag = useRef<boolean>(false);
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);
  
  usePreventScroll();

  const handleDragStart = (event: MouseEvent<HTMLButtonElement>) => {
    startDrag.current = true;
    startCursorPosition.current = event.pageY;
  };

  const handleDragMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!startDrag.current) {
      return;
    }

    if (event.pageY - startCursorPosition.current <= 0) {
      return;
    }

    setMovingCursorPosition(event.pageY - startCursorPosition.current);
  };
  
  const handleDragEnd = () => {
    if (!startDrag.current) {
      return;
    }

    if (movingCursorPositon > 150 && containerRef.current) {
      containerRef.current.dispatchEvent(new Event('click', { bubbles: true }));
    }

    setMovingCursorPosition(0);
    startDrag.current = false;
  };

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
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
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