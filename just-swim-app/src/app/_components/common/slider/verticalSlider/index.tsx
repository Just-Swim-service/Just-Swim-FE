'use client';

import { MouseEvent, TouchEvent, WheelEvent, useEffect, useRef, useState } from 'react';

import { randomId, throttle } from '@utils';

import styled from './styles.module.scss';

export function VerticalSlider({
  itemList,
  initialItem,
  updateItem,
  itemHeight = 60,
  itemsToShow = 3,
  xAxisPadding = 20,
  useBorder = false,
}: {
  itemList: string[],
  initialItem: string,
  updateItem: (item: string) => void,
  itemHeight?: number,
  itemsToShow?: number,
  xAxisPadding?: number
  useBorder?: boolean,
}) {
  const sideItemsToShow = ((itemsToShow - 1) / 2);
  const initialItemIndex = itemList.indexOf(initialItem);

  const containerRef = useRef<HTMLDivElement>(null);
  const startCapture = useRef<boolean>(false);
  const startCursorPosition = useRef<number>(0);

  const [cursorPosition, setCursorPosition] = useState<number>(-(initialItemIndex !== -1 ? initialItemIndex : 0) * itemHeight);
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);  

  // mouse drag
  const endDrag = () => {
    if (startCapture.current) {
      startCapture.current = false;

      setCursorPosition(prev => prev + movingCursorPositon);
      setMovingCursorPosition(0);
    }
  }

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = event.pageY;
    }
 };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      setMovingCursorPosition(event.pageY - startCursorPosition.current);
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
      setMovingCursorPosition(event.targetTouches[0].pageY - startCursorPosition.current);
    }
  };  
  
  const handleTouchCancle = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };

  // mouse wheel
  const handleWheelScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (event.deltaY < 0) {
      if (cursorPosition < 0) {
        setCursorPosition((prev) => prev + itemHeight);
      }
    } else if (cursorPosition > itemHeight * -(itemList.length - 1)) {
      setCursorPosition((prev) => prev - itemHeight);
    }
  };

  useEffect(() => {
    const index = Math.round(cursorPosition / itemHeight);
    let finalValue = index * itemHeight;

    if (finalValue < itemHeight * -(itemList.length - 1)) {
      finalValue = itemHeight * -(itemList.length - 1);
    }

    if (finalValue > 0) {
      finalValue = 0;
    }
    
    const value = -(finalValue / itemHeight);

    setCursorPosition(finalValue);
    updateItem(itemList[value]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPosition]);

  return (
    <div
      ref={containerRef}
      className={styled.container}
      style={{
        height: itemHeight * itemsToShow,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={throttle(handleMouseMove, 10)}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={throttle(handleTouchMove, 10)}
      onTouchCancel={handleTouchCancle}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheelScroll}
    >
      {
        useBorder &&
        <>
          <div className={styled.border} style={{
            top: itemHeight * sideItemsToShow
          }} />
          <div className={styled.border} style={{
            bottom: itemHeight * sideItemsToShow
          }} />
        </>
      }
      {
        new Array(sideItemsToShow).fill(0).map((_, idx) => {
          return (
            <>
              <div
                key={randomId()}
                className={styled.blur} 
                style={{
                  height: itemHeight,
                  top: itemHeight * (sideItemsToShow - 1 - idx),
                  opacity: 0.5 + (idx * 0.2)
                }}
              />
              <div
                key={randomId()}
                className={styled.blur} 
                style={{
                  height: itemHeight,
                  bottom: itemHeight * (sideItemsToShow - 1 - idx),
                  opacity: 0.5 + (idx * 0.2)
                }}
              />
            </>
          )
        })
      }
      <div
        className={styled.item_list} 
        style={{
          height: itemHeight * itemList.length,
          marginTop: itemHeight * sideItemsToShow,
          transform: `translateY(${cursorPosition + movingCursorPositon}px)`
        }}
      >
        {
          itemList.map(item => {
            return (
              <div 
                key={randomId()} 
                className={styled.item}
                style={{
                  height: itemHeight,
                  padding: `0 ${xAxisPadding}px`
                }}
              >
                <div>{item}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}