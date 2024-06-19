"use client";

import { FormButton } from "@components"

import styled from './styles.module.scss';

export default function Test() {
  return (
    <div style={{
      minWidth: 320,
      maxWidth: 640,
      margin: "0 auto"
    }}>
      <form action="" className={styled.form}>
        <FormButton text="확인" active={true} />
      </form>
    </div>
  )
}