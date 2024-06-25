'use client';

import { MouseEvent, TouchEvent, WheelEvent, useEffect, useRef, useState } from 'react';

import { numberFormat, randomId, throttle } from '@utils';

import styled from './styles.module.scss';

export function VerticalScroll({
  value,
  setValue,
  items,
  itemHeight,
  itemsToShow,
}: {
  value: string,
  setValue: Function,
  items: { value: string }[]
  itemHeight: number,
  itemsToShow: number,
}) {
  const sideItemsToShow = ((itemsToShow - 1) / 2);

  const containerRef = useRef<HTMLDivElement>(null);

  const [cursorPosition, setCursorPosition] = useState<number>(-parseInt(value) * itemHeight);
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);
  

  const startCapture = useRef<boolean>(false);
  const startCursorPosition = useRef<number>(0);
  const updateCursorPosition = useRef<boolean>(false);
  const dragStartTime = useRef<number>(0);
  // const dragEndTime = useRef<number>(0);
  const dragType = useRef<string>('slow');
  
  // mouse drag
  const endDrag = () => {
    if (startCapture.current) {
      startCapture.current = false;
      setCursorPosition(prev => prev + movingCursorPositon);
      setMovingCursorPosition(0);

      if (performance.now() - dragStartTime.current <= 100) {
        dragType.current = 'fast';
      } else {
        dragType.current = 'slow';
      }

      updateCursorPosition.current = true;
    }
  }

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = event.clientY;
      dragStartTime.current = performance.now();
    }
 };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      setMovingCursorPosition((event.clientY - startCursorPosition.current) * 3);
    }
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };

  // touch drag
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = event.targetTouches[0].pageY;
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      setMovingCursorPosition(event.targetTouches[0].pageY * 1 - startCursorPosition.current);
    }
  };  
  
  const handleTouchCancle = (event: TouchEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      startCapture.current = false;
      setCursorPosition(prev => prev + movingCursorPositon);
      setMovingCursorPosition(0);
    }
  };
  
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      startCapture.current = false;
      setCursorPosition(prev => prev + movingCursorPositon);
      setMovingCursorPosition(0);
    }
  };

  const handleWheelScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0) {
      if (cursorPosition < 0) {
        setCursorPosition((prev) => prev + itemHeight);
      }
    } else if (cursorPosition > itemHeight * -(items.length - 1)) {
      setCursorPosition((prev) => prev - itemHeight);
    }
  };

  useEffect(() => {
    const index = Math.round(cursorPosition / itemHeight);
    let finalValue = index * itemHeight;

    if (finalValue < itemHeight * -(items.length - 1)) {
      finalValue = itemHeight * -(items.length - 1);
    }

    if (finalValue > 0) {
      finalValue = 0;
    }
    
    const value = -(finalValue / itemHeight);

    setCursorPosition(finalValue);
    setValue(numberFormat(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPosition]);

  return (
    <div
      ref={containerRef}
      className={styled.container}
      onMouseDown={handleMouseDown}
      onMouseMove={throttle(handleMouseMove, 10)}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchCancle}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheelScroll}
    >
      <div className={styled.upper_border} style={{
        top: itemHeight * sideItemsToShow
      }} />
      <div className={styled.lower_border} style={{
        bottom: itemHeight * sideItemsToShow
      }} />
      <div className={styled.upper_blur} style={{
        height: itemHeight * sideItemsToShow - 1,
      }} />
      <div className={styled.lower_blur} style={{
        height: itemHeight * sideItemsToShow - 1,
      }} />
      <div className={`${styled.item_list} ${dragType.current === 'fast' ? styled.picker_fast : styled.picker_slow}`} style={{
        height: itemHeight * items.length,
        marginTop: itemHeight * sideItemsToShow,
        transform: `translateY(${cursorPosition + movingCursorPositon}px)`
      }}>
        {
          items.map(item => {
            return (
              <div key={randomId()} className={styled.item} style={{
                height: itemHeight
              }}>
                <div>{item.value}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}