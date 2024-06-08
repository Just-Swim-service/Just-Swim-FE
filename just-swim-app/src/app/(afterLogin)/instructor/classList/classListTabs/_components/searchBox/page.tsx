import Image from 'next/image';
import searchIcon from '/public/assets/icon_search.png';
import styled from './searchBox.module.scss';

export default function SearchBox() {
  return (
    <>
      <div className={styled.search}>
        <Image src={searchIcon} alt="검색" />
        <input type="text" placeholder="수강생 검색하기" />
      </div>
    </>
  );
}
