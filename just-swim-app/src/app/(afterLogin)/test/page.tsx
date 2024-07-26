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
  SelectPersonInput,
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
      <SelectPersonInput name="fileinput"/>
      <form action={uploadProduct} className={styled.form}>
        <TextInput name="textinput" placeholder="수업명을 입력해주세요" valid={true} />
        <TextArea name="textarea" placeholder="피드백을 입력해주세요" height={100} />
        <LocationInput name="locationinput" placeholder="수업 위치를 선택해 주세요" valid={false} defalutValue="강동구 실내 수영장" />
        <ColorInput name="colorinput" defaultValue='#8B41FF' />
        <TimeInput name="timeinput" placeholder="시간 선택" defaultValue="10:00~14:002"/>
        <DayInput name="dayinput" placeholder="수업 요일을 선택해 주세요" defaultValue="월수" />
        <DateInput name="dateinput" renderIcon={() => <IconRepeatTime width={14} height={14} />} placeholder="종료일 없이 반복" suffix="종료" defaultValue="2024.08.03" use={true} />
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

// 'use client';

// import { useForm } from "react-hook-form";

// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   HistoryBackHeader,
//   TextInput,
//   FormButton,
// } from "@components";

// import { uploadProduct } from "./action";
// import { testSchema, testType } from "./schema";

// import styled from './styles.module.scss';

// export default function Test() {
//   const {
//     register,
//     handleSubmit,
//     formState: {
//       errors,
//       isValid
//     }
//   } = useForm<testType>({
//     resolver: zodResolver(testSchema),
//     mode: 'onChange'
//   });

//   const onSubmit = handleSubmit(async (data: testType) => {
//     console.log(data);

//     const formData = new FormData();

//     formData.append("title", data.title);

//     const result = await uploadProduct(formData);
//   });

//   const onValid = async () => {
//     await onSubmit();
//   }

//   return (
//     <div style={{
//       width: '100%',
//       padding: '0 20px',
//       position: 'relative'
//     }}>
//       <HistoryBackHeader title="수업정보" additionalLink="/" additionalContent="메인 페이지" />
//       <form action={onValid} className={styled.form}>
//         <TextInput {...register('title')} placeholder="수업명을 입력해주세요" valid={!!!errors.title} maxLength={15} />
//         <TextInput {...register('content')} placeholder="수업 내용을 입력해주세요" valid={!!!errors.content} maxLength={30} />
//         <FormButton text="확인" active={true} />
//       </form>
//     </div>
//   )
// }