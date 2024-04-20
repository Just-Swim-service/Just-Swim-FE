import Image from 'next/image';
import searchIcon from '/public/assets/icon_search.png';
import './searchBox.scss';

export default function SearchBox() {
  return (
    <>
      <div className="search">
        <Image src={searchIcon} alt="검색" />
        <input type="text" placeholder="수강생 검색하기" />
      </div>
    </>
  );
}
