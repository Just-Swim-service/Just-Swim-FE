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
import { mergeRefs } from '@utils';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import Link from 'next/link';

import { IconSelectUser } from '@assets';
import { searchClassStore } from '@store';
import { ProfileCard } from '@components';
import { UseFormSetValue } from 'react-hook-form';

interface SelectClassInputProps extends SelectInputProps {
  setValue: UseFormSetValue<any>;
  setFeedbackFormData: any;
  feedbackData: any;
  errors: string[];
}

function _SelectClassInput(
  {
    name,
    setValue,
    lectures,
    setFeedbackFormData,
    feedbackData,
    ...props
  }: SelectClassInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const {
    selectedList,
    removeItemHandler,
    updateSelectedList,
    /* @ts-ignore */
    updateCheckList,
  } = searchClassStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* @ts-ignore */
    lectures?.lectureId && updateSelectedList([lectures]);
    lectures?.lectureId && updateCheckList([lectures]);
  }, [lectures, updateSelectedList, updateCheckList]);

  useEffect(() => {
    const value = selectedList.length > 0 ? JSON.stringify(selectedList) : '';
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    // name 왜 필요?
    setValue(name, value);
  }, [selectedList, name, setValue]);

  return (
    <div className={styled.input_wrapper}>
      <input
        type="text"
        hidden
        {...props}
        name={name}
        ref={mergeRefs(inputRef, ref)}
        multiple
        readOnly
      />
      <div
        className={styled.input_inner_wrapper}
        onClick={() => setFeedbackFormData(feedbackData, 'group')}>
        <Link href={'/feedback/search/class'} className={styled.select_user}>
          <div className={styled.icon_wrapper}>
            <IconSelectUser width={30} height={30} />
            <div className={styled.add_txt}>추가하기</div>
          </div>
        </Link>
      </div>
      <div className={styled.preview_wrapper}>
        {selectedList.map(
          (
            preview: { lectureId: string; lectureTitle: string; members: any[] },
            index: number,
          ) => {
            return (
              <div key={index} className={styled.preview_item}>
                <div className={styled.tag}>전체</div>
                <div className={styled.title}>{preview.lectureTitle}</div>
                <ProfileCard
                  customers={preview.members}
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
          },
        )}
      </div>
    </div>
  );
}

/**
 * 상위 컴포넌트에서 FileInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 */
export const SelectClassInput = forwardRef(_SelectClassInput);
