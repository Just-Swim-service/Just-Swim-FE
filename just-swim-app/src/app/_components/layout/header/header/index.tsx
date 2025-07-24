'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import arrowBackIcon from '@assets/icon_arrow_back.png';

import styled from './header.module.scss';

interface Props {
  title: string;
  routerBackUrl?: string;
  editURL?: string;
  resetFunc1?: () => void;
  resetFunc2?: () => void;
}

export function Header({
  title,
  routerBackUrl,
  editURL,
  resetFunc1,
  resetFunc2,
}: Props) {
  const router = useRouter();

  const goBack = () => {
    if (resetFunc1) {
      resetFunc1();
      if (resetFunc2) {
        resetFunc2();
      }
    }
    if (routerBackUrl) {
      return router.replace(routerBackUrl);
    }
    router.back();
  };

  return (
    <header className={styled.header}>
      <Image
        src={arrowBackIcon}
        alt="뒤로가기"
        onClick={() => goBack()}
        priority
      />
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
