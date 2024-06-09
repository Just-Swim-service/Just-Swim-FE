'use client';

import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';

import { useRouter } from 'next/navigation';
import styled from './header.module.scss';
import Link from 'next/link';

interface Props {
  title: string;
  editURL?: string;
}

export default function Header({ title, editURL }: Props) {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <header className={styled.header}>
      <Image src={arrowBackIcon} alt="뒤로가기" onClick={() => goBack()} />
      <div>{title}</div>
      {editURL ? (
        <Link href={editURL} className={styled.edit}>
          수정하기
        </Link>
      ) : (
        <></>
      )}
    </header>
  );
}
