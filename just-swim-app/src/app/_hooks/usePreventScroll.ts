import { useEffect } from 'react';

export function usePreventScroll() {
  const preventScroll = () => {
    const currentScrollY = window.scrollY;

    // 모바일 환경에서 더 안정적인 스크롤 방지
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.overflowY = 'hidden';
    document.body.style.touchAction = 'none';
    (document.body.style as any).webkitOverflowScrolling = 'auto';

    // iOS Safari에서 추가적인 스크롤 방지
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';

    return currentScrollY;
  };

  const allowScroll = (prevScrollY: number) => {
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflowY = '';
    document.body.style.touchAction = '';
    (document.body.style as any).webkitOverflowScrolling = '';

    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    document.documentElement.style.width = '';
    document.documentElement.style.height = '';

    window.scrollTo(0, prevScrollY);
  };

  useEffect(() => {
    const prevScrollY = preventScroll();

    return () => {
      allowScroll(prevScrollY);
    };
  }, []);
}
