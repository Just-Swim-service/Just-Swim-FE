"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const type = searchParams.get('type');

    console.log("type : ", type);

    const routeHome = () => {
        if (type === 'instructor') {
            router.replace('instructor');
        }
        if (type === 'customer') {
            router.replace('customer');
        }
    }

    const onClickGoogle = () => {
        console.log('구글 로그인');
        routeHome();
    };
    const onClickNaver = () => {
        console.log('네이버 로그인');
        routeHome();
    }
    const onClickKakao = () => {
        console.log('Kakao 로그인');
        routeHome();
    }

    return (
        <div>
            <h1 onClick={onClickGoogle}>구글 로그인</h1>
            <h1 onClick={onClickNaver}>네이버 로그인</h1>
            <h1 onClick={onClickKakao}>카카오톡 로그인</h1>
        </div>
    );
}