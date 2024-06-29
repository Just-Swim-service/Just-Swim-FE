'use client';

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

import { FormButtonProps } from "@types";

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 FormButton에 대한 className을 직접 설정하지 않도록 주의! (제대로 동작하지 않음)
 * @param {string} text button에 들어갈 text
 * @param {string} loading button이 disabled 상태일 때 들어갈 text 
 * @param {boolean} active button의 활성화 여부 
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement>} attributes button에서 사용 가능한 모든 attributes
 */
export function FormButton({
  text,
  loading = "Loading...",
  active = true,
  ...props
}: FormButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();  

  return (
    <button 
      {...props}
      disabled={pending || !active} 
      className={styled.form_button} 
    >
      {pending ? loading : text}
    </button>
  )
}