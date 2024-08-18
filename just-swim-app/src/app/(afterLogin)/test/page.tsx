// 'use client';

// import { 
//   TextInput, 
//   TextArea, 
//   LocationInput,
//   ColorInput,
//   FormButton,
//   TimeInput,
//   DayInput,
//   DateInput,
//   EndDateInput,
//   FileInput,
//   ConfirmButton,
//   SelectPersonInput,
//   LinkInput,
// } from "@components";
// import { IconRepeatTime } from "@assets";

// import { HistoryBackHeader } from "@components";

// import styled from './styles.module.scss';
// import { uploadProduct } from "./action";

// export default function Test() {
//   return (
//     <div style={{
//       width: '100%',
//       padding: '0 20px',
//       position: 'relative'
//     }}>
//       <HistoryBackHeader title="수업정보" additionalLink="/" additionalContent="메인 페이지" />
//       <form action={uploadProduct} className={styled.form}>
//         <TextInput name="textinput" placeholder="수업명을 입력해주세요" valid={true} />
//         <TextArea name="textarea" placeholder="피드백을 입력해주세요" height={100} />
//         <LocationInput name="locationinput" placeholder="수업 위치를 선택해 주세요" valid={false} defalutValue="강동구 실내 수영장" />
//         <ColorInput name="colorinput" defaultValue='#8B41FF' />
//         <TimeInput name="timeinput" placeholder="시간 선택" defaultValue="10:00~14:002"/>
//         <DayInput name="dayinput" placeholder="수업 요일을 선택해 주세요" defaultValue="월수" />
//         <EndDateInput name="dateinput" renderIcon={() => <IconRepeatTime width={16} height={16} />} placeholder="종료일 없이 반복" suffix="종료" />
//         <FormButton text="확인" active={true} />
//       </form>
//       {/* <ConfirmButton text="버튼 1" kind="confirm" active={true} />
//       <ConfirmButton text="버튼 2" kind="confirm-sub" border={false} />
//       <ConfirmButton text="버튼 3" kind="cancel" />
//       <ConfirmButton text="버튼 4" kind="cancel-sub" border={true} />
//       <ConfirmButton text="버튼 5" kind="normal" /> */}
//     </div>
//   )
// }

'use client';

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  HistoryBackHeader,
  TextInput,
  FormButton,
} from "@components";

import { uploadProduct } from "./action";
import { testSchema, testType } from "./schema";

import styled from './styles.module.scss';

export default function Test() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<testType>({
    resolver: zodResolver(testSchema),
    mode: 'onChange'
  });
  
  const onSubmit = handleSubmit(async (data: testType) => {
    const formData = new FormData();

    formData.append("title", data.title);

    const result = await uploadProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  }

  return (
    <div style={{
      width: '100%',
      padding: '0 20px',
      position: 'relative'
    }}>
      <HistoryBackHeader title="수업정보" additionalLink="/" additionalContent="메인 페이지" />
      <form action={onValid} className={styled.form}>
        <TextInput {...register('title')} placeholder="수업명을 입력해주세요" valid={!!!errors.title} maxLength={15} errorMessage={errors.title?.message} />
        <TextInput {...register('content')} placeholder="수업 내용을 입력해주세요" valid={!!!errors.content} maxLength={30} errorMessage={errors.content?.message} />
        <FormButton text="확인" active={true} />
      </form>
    </div>
  )
}