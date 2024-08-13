'use client';

import { MouseEvent, TouchEvent, WheelEvent, useCallback, useEffect, useRef, useState } from 'react';

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
  const initialItemIndex = itemList.indexOf(initialItem) !== -1 ? itemList.indexOf(initialItem) : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const startCapture = useRef<boolean>(false);
  const startCursorPosition = useRef<number>(0);

  const [cursorPosition, setCursorPosition] = useState<number>(-initialItemIndex * itemHeight);
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);  

  const startDrag = useCallback((position: number) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = position;
    }
  }, []);

  const whileDrag = useCallback((position: number) => {
    if (startCapture.current) {
      setMovingCursorPosition(position - startCursorPosition.current);
    }
  }, []);

  const endDrag = useCallback(() => {
    if (startCapture.current) {
      startCapture.current = false;
      
      setCursorPosition(prev => prev + movingCursorPositon);
      setMovingCursorPosition(0);
    }
  }, [movingCursorPositon]);
  
  // mouse drag
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    startDrag(event.pageY);
 };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    whileDrag(event.pageY);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };

  // touch drag
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    startDrag(event.targetTouches[0].pageY);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    whileDrag(event.targetTouches[0].pageY);
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
            <div
              key={randomId()}
              className={styled.blur} 
              style={{
                height: itemHeight,
                top: itemHeight * (sideItemsToShow - 1 - idx),
                opacity: 0.5 + (idx * 0.2)
              }}
            />
          )
        })
      }
      {
        new Array(sideItemsToShow).fill(0).map((_, idx) => {
          return (
            <div
              key={randomId()}
              className={styled.blur} 
              style={{
                height: itemHeight,
                bottom: itemHeight * (sideItemsToShow - 1 - idx),
                opacity: 0.5 + (idx * 0.2)
              }}
            />
          )
        })
      }
      <div
        ref={listRef}
        className={`${styled.item_list} ${styled.use_transition}`} 
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

const checkIndexInRange = (list: string[], index: number) => {
  if (index < 0) {
    index = list.length + index;
  }

  if (index >= list.length) {
    index = index % list.length;
  }

  return index;
}

const initList = (list: string[], initialIndex: number, targetListLength: number): string[] => {
  const side = (targetListLength - 1) / 2;
  const result: string[] = [];

  for (let i = initialIndex - side; i <= initialIndex + side; i++) {
    let index = i;

    index = checkIndexInRange(list, index);
    
    result.push(list[index]);
  }

  return result;
}

const updateList = (list: string[], currentIndex: number, targetListLength: number): string[] => {
  const side = (targetListLength - 1) / 2;
  const result: string[] = [];
  
  for (let i = currentIndex - side; i <= currentIndex + side; i++) {
    let index = i;
    
    index = checkIndexInRange(list, index);
    
    result.push(list[index]);
  }

  return result;
}

export function VerticalSliderLoop({
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
  const initialItemIndex = itemList.indexOf(initialItem) !== -1 ? itemList.indexOf(initialItem) : 0;

  const listLength = itemsToShow * 2 + 1;
  const middleIndex = itemsToShow;
  const middleY = (middleIndex - sideItemsToShow) * itemHeight;

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const startCapture = useRef<boolean>(false);
  const startCursorPosition = useRef<number>(0);

  const currentIndex = useRef<number>(initialItemIndex);
  const updatePosition = useRef<number>(0);
  const marginTop = useRef<number>(0);

  const [list, setList] = useState<string[]>(initList(itemList, initialItemIndex, listLength));
  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  const startDrag = useCallback((position: number) => {
    if (animating) {
      return;
    }

    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = position;
      updatePosition.current = position;

      listRef.current?.style.setProperty('transition', 'transform 600ms cubic-bezier(0.13, 0.67, 0.01, 0.94)');
    }
  }, [animating]);

  const whileDrag = useCallback((position: number) => {
    if (startCapture.current) {
      setMovingCursorPosition(position - startCursorPosition.current);

      if (position > updatePosition.current) {
        if (position - updatePosition.current > itemHeight / 2) {
          currentIndex.current = currentIndex.current - 1;
          updatePosition.current = updatePosition.current + itemHeight;
          marginTop.current = marginTop.current - itemHeight;

          currentIndex.current = checkIndexInRange(itemList, currentIndex.current);

          setList(updateList(itemList, currentIndex.current, listLength));
        } 
      } else {
        if (updatePosition.current - position > itemHeight / 2) {
          currentIndex.current = currentIndex.current + 1;
          updatePosition.current = updatePosition.current - itemHeight;
          marginTop.current = marginTop.current + itemHeight;

          currentIndex.current = checkIndexInRange(itemList, currentIndex.current);

          setList(updateList(itemList, currentIndex.current, listLength));
        } 
      }
    }
  }, [itemHeight, itemList, listLength]);

  const endDrag = useCallback(() => {
    if (startCapture.current) {
      startCapture.current = false;
      
      setAnimating(true);
    }
  }, []);

  // mouse drag
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    startDrag(event.pageY);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    whileDrag(event.pageY);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };

  // touch drag
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    startDrag(event.targetTouches[0].pageY);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    whileDrag(event.targetTouches[0].pageY);
  };
  
  const handleTouchCancle = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };

  useEffect(() => {
    if (!animating) {
      return;
    }

    const count = Math.floor(Math.abs(movingCursorPositon) / itemHeight);
    const rest = Math.abs(movingCursorPositon % itemHeight);

    if (rest <= itemHeight / 2) {
      setMovingCursorPosition(count * itemHeight * (movingCursorPositon > 0 ? 1 : -1));
    } else {
      setMovingCursorPosition((count + 1) * itemHeight * (movingCursorPositon > 0 ? 1 : -1));
    }

    updateItem(itemList[currentIndex.current]);
    
    setTimeout(() => {
      listRef.current?.style.setProperty('transition', '');

      marginTop.current = 0;

      setAnimating(false);
      setMovingCursorPosition(0);
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

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
            <div
              key={randomId()}
              className={styled.blur} 
              style={{
                height: itemHeight,
                top: itemHeight * (sideItemsToShow - 1 - idx),
                opacity: 0.5 + (idx * 0.2)
              }}
            />
          )
        })
      }
      {
        new Array(sideItemsToShow).fill(0).map((_, idx) => {
          return (
            <div
              key={randomId()}
              className={styled.blur} 
              style={{
                height: itemHeight,
                bottom: itemHeight * (sideItemsToShow - 1 - idx),
                opacity: 0.5 + (idx * 0.2)
              }}
            />
          )
        })
      }
      <div
        ref={listRef}
        className={styled.item_list} 
        style={{
          height: itemHeight * itemList.length,
          marginTop: marginTop.current,
          transform: `translateY(${movingCursorPositon - middleY}px)`
        }}
      >
        {
          list.map(item => {
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