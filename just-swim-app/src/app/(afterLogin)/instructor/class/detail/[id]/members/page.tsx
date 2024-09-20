'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from './members.module.scss';

import { Header } from '@components';
import { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LectureMembersProps } from '@types';
import { IconArrowRight, IconArrowRightSmall, IconSearch } from '@assets';

export default function Members() {
  const params = useParams();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/memberList/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_TOKEN}`;

  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMembers(data.data);
      });
  }, [lectureId]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useLayoutEffect(() => {
    if (members) {
      setMembers(members);
    }
  }, [members]);

  return (
    <div className={styled.customerList}>
      <Header title="수강생 목록" />
      <div className={styled.inner}>
        <div className={styled.search}>
          <IconSearch />
          <input
            type="text"
            placeholder="수강생 이름으로 검색"
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        <div>
          <div className={`${styled.row} ${styled.title}`}>
            <div>아침 5반</div>
            <button>가나다순</button>
          </div>
          {members &&
            members.map((item: LectureMembersProps, index) => (
              <li key={index} className={styled.customer}>
                <label className={`${styled.row}`} htmlFor={`checkbox ${index}`}>
                  <Image
                    src={item.profileImage}
                    alt="profile"
                    width={34}
                    height={34}
                    style={{ borderRadius: '34px' }}
                  />

                  <div>{item.name}</div>
                </label>

                <Link href={`/user/${item.userId}`}>
                  <IconArrowRightSmall height="10" fill="black" />
                </Link>
              </li>
            ))}
        </div>
      </div>
    </div>
  );
}
