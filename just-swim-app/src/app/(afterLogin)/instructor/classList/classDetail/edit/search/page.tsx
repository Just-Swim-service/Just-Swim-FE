import Header from '@/app/_component/Header';
import searchIcon from '/public/assets/icon_search.png';
import Image from 'next/image';
import './locationSearch.scss';

export default function LocationSearch() {
  return (
    <div className="location_search">
      <Header title={'수업 위치 설정'} />
      <div className="location_search_input">
        <div className="search">
          <input type="text" placeholder="수업 장소 검색" />
          <button>
            <Image src={searchIcon} alt="검색" />
          </button>
        </div>
      </div>
      <div className="divider"></div>
      {/*  */}
      <div className="location_search_output">
        <ul>
          <li className="location">
            <input type="checkbox" />
            <label className="location_info">
              <div className="title">수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
          <li className="location">
            <input type="checkbox" />
            <label className="location_info">
              <div className="title">수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
          <li className="location">
            <input type="checkbox" />
            <label className="location_info">
              <div className="title">수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>{' '}
          <li className="location">
            <input type="checkbox" />
            <label className="location_info">
              <div className="title">수영장</div>
              <div>서울 강동구 고덕로 28</div>
            </label>
          </li>
        </ul>
        <div className="button_box">
          <button className="submit_btn">위치 선택하기</button>
        </div>
      </div>
    </div>
  );
}
