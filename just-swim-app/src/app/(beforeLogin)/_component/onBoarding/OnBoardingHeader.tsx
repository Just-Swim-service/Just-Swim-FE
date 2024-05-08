import Logo from '/public/assets/logo.svg';
import Image from 'next/image';

import '@/app/(beforeLogin)/common.scss';

export default function OnBoardingHeader() {
  return (
    <>
      <div className='header'>
        <div className='headerLogo'>
          <Image className='logo' src={Logo} alt="SWIM 로고" />
          <h3>수영인들을 위한 소통 창구</h3>
        </div>
        <div>
          <p>
            원활한 서비스 이용을 위해
            <br />
            회원 가입 혹은 로그인을 진행해 주세요.
          </p>
        </div>
      </div>
    </>
  );
}
