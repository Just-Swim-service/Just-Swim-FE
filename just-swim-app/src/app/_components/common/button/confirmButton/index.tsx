'use client';

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

import { ConfirmButtonProps } from "@types";

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 ConfirmButton에 대한 className을 직접 설정하지 않도록 주의! (제대로 동작하지 않음)
 * @param {string} text button에 들어갈 text
 * @param {string} kind button의 종류 -> 'confirm' | 'confirm-sub' | 'cancel' | 'cancel-sub' | 'normal'
 * @param {boolean} border button의 border 사용 여부, confirm-sub, cancel-sub에서만 동작
 * @param {string} loading button이 disabled 상태일 때 들어갈 text 
 * @param {boolean} active button의 활성화 여부
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement>} attributes button에서 사용 가능한 모든 attributes
 */
export function ConfirmButton({
  text,
  kind,
  border = false,
  loading = "Loading...",
  active = true,
  ...props
}: ConfirmButtonProps & ButtonHTMLAttributes<HTMLButtonElement> ) {
  const { pending } = useFormStatus();  

  const styles = {
    'confirm': styled.confirm_button,
    'confirm-sub': styled.confirm_sub_button,
    'cancel': styled.cancel_button,
    'cancel-sub': styled.cancel_sub_button,
    'normal': styled.normal_button
  }

  return (
    <button
      {...props}
      disabled={pending || !active} 
      className={`${styled.button} ${styles[kind]} ${border && styled.border_button}`}
    >
      {pending ? loading : text}
    </button>
  );
}