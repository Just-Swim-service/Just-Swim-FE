"use client"

import Image from 'next/image';
import arrowBackIcon from '/public/assets/icon_arrow_back.png';

import './header.scss';
import { useRouter } from 'next/navigation'

interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  return (
    <header>
      <Image src={arrowBackIcon} alt="뒤로가기" onClick={()=> goBack()} />
      <div>{title}</div>
    </header>
  );
}
