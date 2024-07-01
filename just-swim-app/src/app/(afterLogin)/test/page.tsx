'use client';

import { 
  TextInput, 
  TextArea, 
  LocationInput,
  ColorInput,
  FormButton,
  TimeInput,
  DayInput,
  DateInput,
  FileInput,
  ConfirmButton,
  LinkInput,
} from "@components";
import { IconRepeatTime } from "@assets";

import { HistoryBackHeader } from "@components";

import styled from './styles.module.scss';
import { uploadProduct } from "./action";

export default function Test() {
  return (
    <div style={{
      width: '100%',
      padding: '0 20px',
      position: 'relative'
    }}>
      <HistoryBackHeader title="수업정보" additionalLink="/" additionalContent="메인 페이지" />
      <form action={uploadProduct} className={styled.form}>
        <TextInput name="textinput" placeholder="수업명을 입력해주세요" valid={true} />
        <TextArea name="textarea" placeholder="피드백을 입력해주세요" height={100} />
        <LocationInput name="locationinput" placeholder="수업 위치를 선택해 주세요" valid={false} />
        <ColorInput name="colorinput" defaultValue='#8B41FF' />
        <TimeInput name="timeinput" placeholder="시간 선택" defaultValue="10:00~14:002"/>
        <DayInput name="dayinput" placeholder="수업 요일을 선택해 주세요" defaultValue="월수" />
        <DateInput name="dateinput" renderIcon={() => <IconRepeatTime width={14} height={14} />} placeholder="종료일 없이 반복" suffix="종료" defaultValue="2024.08.03" />
        <FileInput name="fileinput" />
        <LinkInput name="linkinput" placeholder="add link" />
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