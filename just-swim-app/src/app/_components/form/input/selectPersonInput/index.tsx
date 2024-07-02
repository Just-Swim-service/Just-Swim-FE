'use client';

import { MouseEvent, forwardRef, useState, ForwardedRef, useEffect } from 'react';

import { SelectPersonInputProps } from '@types';
import { randomId } from '@utils';
import { IconCancelWhite } from '@assets';

import styled from './styles.module.scss';
import Link from 'next/link';

import { IconSelectUser } from '@assets';
import { searchUserStore } from '@store';

function _SelectPersonInput({
  name,
  ...props
}: SelectPersonInputProps, 
ref: ForwardedRef<HTMLInputElement>) {
  
  const { checkedList,removeItemHandler } = searchUserStore();

  const [selectUser, setSelectUser] = useState(checkedList)
  
  useEffect(() => {
    setSelectUser(checkedList)
  }, [checkedList])


  return (
    <div className={styled.input_wrapper}>
      <Link
        href={'/instructor/feedback/search/person'}
        className={styled.select_user}>
        <div className={styled.icon_wrapper}>
          <IconSelectUser width={30} height={30} />
          <div className={styled.add_txt}>추가하기</div>
        </div>
      </Link>
      <div className={styled.preview_wrapper}>
        {
          checkedList.map((preview, index) => {
            return (
              <div key={randomId()} className={styled.preview_item} >
                <div className={styled.profileImg} style={{backgroundImage: `url(${preview.profileImage})`}}></div>
                <div className={styled.name}>{preview.memberNickname}</div>
                <div className={styled.class}>아침5반</div>

                <button className={styled.delete_button} onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  event.preventDefault();
                  
                  removeItemHandler(preview.userId);
                }}>
                  <IconCancelWhite width={14} height={14} />
                </button>
              </div>
            )
          })
        }
      </div>
      
    </div>
  );
}

/**
 * 상위 컴포넌트에서 FileInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 */
export const SelectPersonInput = forwardRef(_SelectPersonInput);