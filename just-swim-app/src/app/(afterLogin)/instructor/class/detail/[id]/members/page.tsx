'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from './members.module.scss';

import { Header } from '@components';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { LectureMembersProps } from '@types';
import { IconArrowDown, IconArrowRightSmall, IconSearch } from '@assets';

export default function Members() {
  const params = useParams();

  const lectureId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/memberList/${lectureId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_TOKEN}`;

  const [members, setMembers] = useState<LectureMembersProps[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc'>('none');

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

  const filteredAndSortedMembers = useMemo(() => {
    let filteredMembers = members.filter((member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    if (sortOrder === 'asc') {
      filteredMembers = filteredMembers.sort((a, b) =>
        a.name.localeCompare(b.name, 'ko-KR'),
      );
    }

    return filteredMembers;
  }, [members, searchText, sortOrder]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 'none') return 'asc';
      return 'none';
    });
  };

  return (
    <div className={styled.customerList}>
      <Header title="수강생 목록" />
      <div className={styled.inner}>
        <div className={styled.search}>
          <IconSearch className={styled.search_icon} />
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
            <button onClick={toggleSortOrder}>
              가나다순{' '}
              <IconArrowDown
                height="4"
                fill={sortOrder === 'none' ? 'none' : '#00ff00'}
                className={styled.icon}
              />
            </button>
          </div>
          {filteredAndSortedMembers.map((item) => (
            <li key={item.userId} className={styled.customer}>
              <label className={styled.row} htmlFor={`checkbox-${item.userId}`}>
                <Image
                  src={item.profileImage}
                  alt={`${item.name}의 프로필 이미지`}
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
