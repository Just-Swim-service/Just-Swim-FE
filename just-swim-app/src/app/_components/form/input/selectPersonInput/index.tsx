'use client';

import {
  MouseEvent,
  forwardRef,
  useState,
  ForwardedRef,
  useEffect,
  useRef,
} from 'react';

import { SelectInputProps } from '@types';
import { randomId, mergeRefs } from '@utils';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import Link from 'next/link';

import { IconSelectUser } from '@assets';
import { searchUserStore } from '@store';
import { UseFormSetValue } from 'react-hook-form';

interface SelectPersonInputProps extends SelectInputProps {
  setFeedbackFormData: any;
  setValue: UseFormSetValue<any>;
  feedbackData: any;
  errors: string[];
}

function _SelectPersonInput(
  // @ts-ignore
  {
    name,
    setValue,
    members,
    setFeedbackFormData,
    feedbackData,
    ...props
  }: SelectPersonInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const {
    selectedList,
    removeItemHandler,
    updateSelectedList,
    updateCheckList,
  } = searchUserStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* @ts-ignore */
    members?.userId && updateSelectedList([members]);
    members?.userId && updateCheckList([members]);
  }, [members, updateSelectedList, updateCheckList]);

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
      <div
        className={styled.input_inner_wrapper}
        onClick={() => setFeedbackFormData(feedbackData, 'personal')}>
        <Link href={'/feedback/search/person'} className={styled.select_user}>
          <div className={styled.icon_wrapper}>
            <IconSelectUser width={30} height={30} />
            <div className={styled.add_txt}>추가하기</div>
          </div>
        </Link>
      </div>
      <div className={styled.preview_wrapper}>
        {selectedList.map((preview: any, index: number) => {
          return (
            <div key={index} className={styled.preview_item}>
              <div
                className={styled.profileImg}
                style={{
                  backgroundImage: `url(${preview.profileImage})`,
                }}></div>
              <div className={styled.name}>{preview.memberNickname}</div>
              <div className={styled.class}>{preview.lectureTitle}</div>

              <button
                className={styled.delete_button}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  event.preventDefault();

                  removeItemHandler(preview.userId);
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
export const SelectPersonInput = forwardRef(_SelectPersonInput);
