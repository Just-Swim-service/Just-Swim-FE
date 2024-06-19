"use client";

import { 
  TextInput, 
  TextArea, 
  LocationInput,
  FormButton 
} from "@components"

import styled from './styles.module.scss';

export default function Test() {
  return (
    <div style={{
      minWidth: 320,
      maxWidth: 640,
      margin: "0 auto"
    }}>
      <form action="" className={styled.form}>
        <TextInput name="textinput" placeholder="수업명을 입력해주세요" valid={false} />
        <TextArea name="textarea" placeholder="피드백을 입력해주세요" height={100} />
        <LocationInput name="locationinput" placeholder="수업 위치를 선택해 주세요" valid={false} />
        <FormButton text="확인" active={true} />
      </form>
    </div>
  )
}