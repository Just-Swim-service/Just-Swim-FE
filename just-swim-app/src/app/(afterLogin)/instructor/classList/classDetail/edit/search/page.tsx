import { Header } from '@components';
import searchIcon from '/public/assets/icon_search.png';
import Image from 'next/image';
import styled from './locationSearch.module.scss';

export default function LocationSearch() {
  return (
    <div className={styled.location_search}>
      <Header title={'수업 위치 설정'} />
      <div className={styled.location_search_input}>
        <div className={styled.search}>
          <input type="text" placeholder="수업 장소 검색" />
          <button>
            <Image src={searchIcon} alt="검색" />
          </button>
        </div>
      </div>
      <div className={styled.divider}></div>
      <div className={styled.location_search_output}>
        <ul>
          <li className={styled.location}>
            <input type="checkbox" />
            <label className={styled.location_info}>
              <div className={styled.title}>수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
          <li className={styled.location}>
            <input type="checkbox" />
            <label className={styled.location_info}>
              <div className={styled.title}>수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
          <li className={styled.location}>
            <input type="checkbox" />
            <label className={styled.location_info}>
              <div className={styled.title}>수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
          <li className={styled.location}>
            <input type="checkbox" />
            <label className={styled.location_info}>
              <div className={styled.title}>수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
        </ul>
        <div className={styled.button_box}>
          <button className={styled.submit_btn}>위치 선택하기</button>
        </div>
      </div>
    </div>
  );
}
