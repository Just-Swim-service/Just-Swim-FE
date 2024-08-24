'use client';

import { useRouter } from "next/navigation";

import { ConfirmButton } from "@components";

import styled from './styles.module.scss';

export function ButtonWrapper({
  id
}: {
  id: string
}) {
  const router = useRouter();

  const onClickHome = () => {
    router.push(`/schedule/weekly`);
  }

  const onClickEdit = () => {
    router.push(`/schedule/edit/${id}`);
  }

  return (
    <div className={styled.button_wrapper}>
      <ConfirmButton text='홈 화면으로 돌아가기' kind='confirm' onClick={onClickHome} />
      <ConfirmButton text='정보 변경하기' kind='confirm-sub' onClick={onClickEdit} />
    </div>
  )
}