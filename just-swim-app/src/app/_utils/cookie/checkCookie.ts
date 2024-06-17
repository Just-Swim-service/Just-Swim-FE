export const checkCookie = (type: string) => {
  console.log('쿠키 또는 로컬스토리지 확인');

  // 쿠키에 접근하여 타입 확인
  if (type) {
    console.log('타입 존재');
    return true;
  } else {
    console.log('타입 없음');
    return false;
  }
};