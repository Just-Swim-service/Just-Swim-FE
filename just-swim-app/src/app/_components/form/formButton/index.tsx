'use client';

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

import { FormButtonProps } from "@types";

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 FormButton에 대한 className을 직접 설정하지 않도록 주의!
 * @param {Object} params 객체 형태로 props 전달
 * @param {string} params.text button에 들어갈 text
 * @param {number} params.loading button이 disabled 상태일 때 들어갈 text 
 */
export function FormButton({
  text,
  loading = "Loading...",
  active = true,
  ...props
}: FormButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();  

  return (
    <button disabled={pending || !active} className={styled.form_button} {...props}>
      {pending ? loading : text}
    </button>
  )
}