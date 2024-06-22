"use client";

import { 
  TextInput, 
  TextArea, 
  LocationInput,
  ColorInput,
  FormButton,
  TimeInput,
  DayInput,
  DateInput,
  ConfirmButton,

  RepeatTimeSVG
} from "@components"

import styled from './styles.module.scss';

export default function Test() {
  

  return (
    <div style={{
      width: '100%',
      padding: '0 20px',
      position: 'relative'
    }}>
      <form action="" className={styled.form}>
        <TextInput name="textinput" placeholder="수업명을 입력해주세요" valid={true} />
        <TextArea name="textarea" placeholder="피드백을 입력해주세요" height={100} />
        <LocationInput name="locationinput" placeholder="수업 위치를 선택해 주세요" valid={false} />
        <ColorInput name="colorinput" defaultValue='#8B41FF' />
        <TimeInput name="timeinput" placeholder="시간 선택" defaultValue="15:22"/>
        <DayInput name="dayinput" placeholder="수업 요일을 선택해 주세요" defaultValue="월, 수요일" />
        <DateInput name="dateinput" renderIcon={() => <RepeatTimeSVG width={14} height={14} />} placeholder="종료일 없이 반복" suffix="종료" defaultValue="2024년 8월 3일" />
        <FormButton text="확인" active={true} />
      </form>
      {/* <ConfirmButton text="버튼 1" kind="confirm" active={true} />
      <ConfirmButton text="버튼 2" kind="confirm-sub" border={false} />
      <ConfirmButton text="버튼 3" kind="cancel" />
      <ConfirmButton text="버튼 4" kind="cancel-sub" border={true} />
      <ConfirmButton text="버튼 5" kind="normal" /> */}
    </div>
  )
}