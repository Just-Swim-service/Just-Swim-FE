import styled from './customerInfo.module.scss';
import DateRange from '@assets/date_range.svg';
import Phone from '@assets/phone.svg';
import Email from '@assets/email.svg';

export default function CustomerInfo() {
  return (
    <>
      <div className={styled.customer_info}>
        <div className={styled.circle}></div>
        <p className={styled.name}>홍길동</p>
        <div className={styled.user_info}>
          <span className={styled.icon}>
            <DateRange />
          </span>
          <p>1998년 11월 11일</p>
        </div>
        <div className={styled.user_info}>
          <span className={styled.icon}>
            <Email />
          </span>
          <p>11223344abcd@gmail.com</p>
        </div>
        <div className={styled.user_info}>
          <span className={styled.icon}>
            <Phone />
          </span>
          <p>등록된 번호가 없습니다.</p>
        </div>
      </div>
      <div className={styled.bar}></div>
    </>
  );
}
