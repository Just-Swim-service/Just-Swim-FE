"use client";

import { TextInput, TextArea, FormButton } from "@components"

import styled from './styles.module.scss';

export default function Test() {
  return (
    <div style={{
      minWidth: 320,
      maxWidth: 640,
      margin: "0 auto"
    }}>
      <form action="" className={styled.form}>
        <TextInput name="test" placeholder="수업명을 입력해주세요" valid={false} />
        <TextArea name="test" placeholder="피드백을 입력해주세요" height={100} />
        <FormButton text="확인" active={true} />
      </form>
    </div>
  )
}