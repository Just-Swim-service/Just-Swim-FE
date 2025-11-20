'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@store';

export default function DashboardPage() {
  const router = useRouter();
  const { profileInfo, loadProfileInfo, isLoading } = useUserStore();

  useEffect(() => {
    redirectToCorrectDashboard();
  }, [profileInfo, isLoading]);

  const redirectToCorrectDashboard = async () => {
    // 프로필 정보가 없으면 로드
    if (!profileInfo && !isLoading) {
      await loadProfileInfo();
      return;
    }

    // 프로필 정보가 로딩 중이면 대기
    if (isLoading) {
      return;
    }

    // 사용자 타입에 따라 적절한 대시보드로 리다이렉트
    if (profileInfo?.userType === 'instructor') {
      router.replace('/dashboard/instructor');
    } else if (profileInfo?.userType === 'customer') {
      router.replace('/dashboard/customer');
    } else {
      // userType이 없으면 기본적으로 customer로 리다이렉트
      router.replace('/dashboard/customer');
    }
  };

  // 리다이렉트 중 로딩 표시
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>대시보드로 이동 중...</p>
    </div>
  );
}

