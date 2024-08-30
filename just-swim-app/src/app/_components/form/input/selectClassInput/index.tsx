'use client';

import {
  MouseEvent,
  forwardRef,
  useState,
  ForwardedRef,
  useEffect,
  useRef,
} from 'react';

import { SelectPersonInputProps } from '@types';
import { randomId, mergeRefs } from '@utils';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import Link from 'next/link';

import { IconSelectUser } from '@assets';
import { searchClassStore } from '@store';
import { Profile } from '@/_components/temp';

function _SelectClassInput(
  // @ts-ignore
  { name, setValue, lecture, ...props }: SelectPersonInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const {
    selectedList,
    removeItemHandler,
    updateSelectedList,
    updateCheckList,
  } = searchClassStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lecture?.lectureId && updateSelectedList([lecture]);
    lecture?.lectureId && updateCheckList([lecture]);
  }, [lecture]);

  useEffect(() => {
    const value = selectedList.length > 0 ? JSON.stringify(selectedList) : '';
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    setValue(name, value);
  }, [selectedList, name, setValue]);

  return (
    <div className={styled.input_wrapper}>
      <input
        type="text"
        hidden
        {...props}
        name={name}
        // id={id}
        ref={mergeRefs(inputRef, ref)}
        multiple
        readOnly
      />
      <div className={styled.input_inner_wrapper}>
        <Link
          href={'/instructor/feedback/search/class'}
          className={styled.select_user}>
          <div className={styled.icon_wrapper}>
            <IconSelectUser width={30} height={30} />
            <div className={styled.add_txt}>추가하기</div>
          </div>
        </Link>
      </div>
      <div className={styled.preview_wrapper}>
        {selectedList.map((preview, index) => {
          return (
            <div key={randomId()} className={styled.preview_item}>
              <div className={styled.tag}>전체</div>
              <div className={styled.title}>{preview.lectureTitle}</div>
              <Profile
                // @ts-ignore
                customers={selectedList[0].members}
                width={28}
                height={28}
                xMargin={-6}
                count={true}
              />

              <button
                className={styled.delete_button}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  event.preventDefault();

                  removeItemHandler(preview.lectureId);
                }}>
                <IconCancelWhite width={14} height={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 상위 컴포넌트에서 FileInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 */
export const SelectClassInput = forwardRef(_SelectClassInput);
