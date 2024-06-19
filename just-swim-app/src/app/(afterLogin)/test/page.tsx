"use client";

import { FormButton, TextInput } from "@components"

import styled from './styles.module.scss';

export default function Test() {
  return (
    <div style={{
      minWidth: 320,
      maxWidth: 640,
      margin: "0 auto"
    }}>
      <form action="" className={styled.form}>
        <TextInput name="test" placeholder="수업명을 입력해주세요" required />
        <FormButton text="확인" active={true} />
      </form>
    </div>
  )
}