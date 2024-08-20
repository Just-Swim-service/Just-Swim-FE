'use client';

import React from "react";
import { useRouter } from "next/navigation";;

import { PageContext } from "./layout";

export default function Test() {
  const context = React.useContext(PageContext);

  const router = useRouter();

  const showToast = () => {
    context.showToast();
    router.push('/test/change');
  }

  return (
    <div style={{
      width: '100%',
      padding: '0 20px',
      position: 'relative'
    }}>
      <p>이전 페이지</p>
      <button onClick={showToast}>Toast 출력</button>
    </div>
  )
}