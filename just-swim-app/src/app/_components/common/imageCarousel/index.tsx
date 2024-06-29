'use client';

import { Dispatch, MouseEvent, SetStateAction, TouchEvent, useRef, useState } from 'react';
import Image from 'next/image';

import { IconCancelWhiteSVG, IconCarouselDeleteSVG } from '@components';
import { randomId, throttle } from '@utils';

import styled from './styles.module.scss';

export function ImageCarousel({
  images,
  index,
  setIndex,
  useDeleteButton = false,
  deleteImage = (index: number) => {},
  hideModal,
}: {
  images: string[],
  index: number,
  setIndex: Dispatch<SetStateAction<number>>,
  useDeleteButton?: boolean,
  deleteImage?: (index: number) => void,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);

  const startCapture = useRef<boolean>(false);
  const startCursorPosition = useRef<number>(0);

  const endDrag = () => {
    if (startCapture.current) {
      if (movingCursorPositon < -100 && index < images.length - 1) {
        setIndex(i => i + 1);
      }

      if (movingCursorPositon > 100 && index > 0) {
        setIndex(i => i - 1);
      }

      startCapture.current = false;
      setMovingCursorPosition(0);
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = event.pageX;
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!startCapture.current) {
      startCapture.current = true;
      startCursorPosition.current = event.targetTouches[0].pageX;
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      if (movingCursorPositon < 100 && movingCursorPositon > -100) {
        setMovingCursorPosition(event.pageX - startCursorPosition.current);
      }
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (startCapture.current) {
      if (movingCursorPositon < 100 && movingCursorPositon > -100) {
        setMovingCursorPosition(event.targetTouches[0].pageX - startCursorPosition.current);
      }
    }
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleTouchCancle = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    endDrag();
  };
  
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    endDrag();
  };

  return (
    <div className={styled.carousel_wrapper}>
      <button className={styled.close_button} onClick={hideModal}>
        <IconCancelWhiteSVG width={14} height={14} />
      </button>
      <div 
        className={styled.slider_wrapper}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={throttle(handleMouseMove, 20)}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={throttle(handleTouchMove, 20)}
        onTouchCancel={handleTouchCancle}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={styled.slider} 
          style={{
            transform: `translateX(calc(${-100 * index}% + ${movingCursorPositon}px))`
          }}
        >
          {
            images.map(image => {
              return (
                <div key={randomId()} className={styled.slider_item}>
                  <div className={styled.image_wrapper}>
                    <Image src={image} alt='image' fill />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={styled.index_list}>
        {
          images.map((_, idx) => {
            return (
              <div key={randomId()} className={`${styled.normal} ${index === idx ? styled.selected : ''}`} onClick={() => {setIndex(idx)}} />
            )
          })
        }
      </div>
      {
        useDeleteButton &&
        <button className={styled.delete_button} onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
  
          deleteImage(index);
        }}>
          <IconCarouselDeleteSVG width={40} height={40} />
          <span>삭제하기</span>
        </button>
      }
    </div>
  )
}