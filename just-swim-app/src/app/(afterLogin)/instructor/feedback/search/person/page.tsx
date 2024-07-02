'use client';

import { ChangeEvent, useState } from 'react';

import Image from 'next/image';
import searchIcon from '/public/assets/icon_search.png';
import iconArrowDown from '@assets/icon_arrow_down.png';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Header } from '@components';
import styled from './searchPerson.module.scss';
import { randomId } from '@utils';
import Link from 'next/link';
import { searchUserStore } from '@store';

// interface Member {
//   "memberId": string;
//   "userId": string;
//   "memberNickname": string;
//   "profileImage": string;
// }


export default function SearchPerson() {
  const { userList, checkedList, checkItemHandler } = searchUserStore();

  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // const [userList, setuserList] = useState([
  //   {
  //     "memberId": "1",
  //     "userId": "1",
  //     "memberNickname": "홍길동",
  //     "profileImage": "http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg"
  //   },
  //   {
  //     "memberId": "2",
  //     "userId": "10",
  //     "memberNickname": "홍길순",
  //     "profileImage": "http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg"
  //   }
  // ])

  // const checkItemHandler = (e: ChangeEvent<HTMLInputElement>, userId: string) => {
  //   e.preventDefault();


  //   const memberToToggle = userList.find(member => member.userId === userId);
  //   if (!memberToToggle) {
  //     return;
  //   }

  //   const isAlreadyChecked = checkedList?.some(item => item.userId === userId);

  //   const newList = isAlreadyChecked
  //     ? checkedList.filter(member => member.userId !== userId)
  //     : [...checkedList, memberToToggle];

  //   setCheckedList(newList);
  //   // console.log(newList);
  // };


  const checkLength = () => {
    const checkedCount = checkedList.length
    return checkedCount;
  };

  return (
    <div className={styled.wrapper}>
      <Header title="회원 선택" />

      <div className={styled.pad}>
        <div className={styled.title}>
          피드백을 남길 <br />
          수강생을 선택해주세요
        </div>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
          <Tabs
            sx={{ width: '100%', display: 'flex' }}
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example">
            <Tab sx={{ flex: 1 }} value="one" label="수업별로 보기" />
            <Tab sx={{ flex: 1 }} value="two" label="이름순으로 보기" />
          </Tabs>
        </Box>

        <div className={styled.inner}>
          <div className={styled.search}>
            <input type="text" placeholder="수강생 이름으로 검색" />
            <button>
              <Image src={searchIcon} alt="검색" />
            </button>
          </div>

          <div className={`${styled.row} ${styled.title}`}>
            <div>수업명</div>
            <button>
              <div>오름차순</div>
              <Image src={iconArrowDown} alt="펼치기" />
            </button>
          </div>
        </div>
      </div>

      <div className={styled.divider}></div>

      
      <div className={styled.pad}>
        {userList.map((member, index) => {
          return (
            <div key={randomId()} className={styled.group}>
              <div className={styled.group_name}>
                아침 5반
              </div>
            {
                <li key={member.userId} className={styled.customer}>
                   <input
                    type="checkbox"
                    id={member.userId}
                    onChange={(e) => checkItemHandler(e, member.userId)}
                    checked={checkedList.some(item => item.userId === member.userId)}
                    />
                  <label className={styled.row} htmlFor={`checkbox ${member}`}>
                    <div
                      className={styled.profile_img}
                      style={{backgroundImage: `url(${member.profileImage})`}}
                    />
                    <div>{member.memberNickname}</div>
                  </label>
                  <div className={styled.customer_class_name}>아침 5반</div>
                </li>
             }
          </div>
          )
        })}
      </div>

      <div className={styled.main_btn}>
          <Link
            type="button"
            // as="/instructor/feedback/write/person"
            href={{
              pathname: "/instructor/feedback/write/person",
              // query: { name: JSON.stringify(checkedList) },
            }}
            className={` ${checkLength() == 0 ? styled.disabled : ''}`}
            >
            {checkLength()}명 선택하기
          </Link>
        </div>
    </div>
  );
}
