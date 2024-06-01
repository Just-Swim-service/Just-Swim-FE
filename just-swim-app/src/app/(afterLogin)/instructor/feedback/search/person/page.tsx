'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import Header from '@_component/Header';
import searchIcon from '/public/assets/icon_search.png';
import arrowRightIcon from '/public/assets/icon_arrow_right.png';
import iconArrowDown from '@assets/icon_arrow_down.svg';
import Link from 'next/link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useCostomerStore } from '@/app/store/store';
import styled from './searchPerson.module.scss';

export default function SearchPerson() {
  const { customerList, checkItem, removeItem } = useCostomerStore();
  // const customerList = [
  //   { name: '김고독', profile: 'profile1' },
  //   { name: '김고독', profile: 'no_profile' },
  //   { name: '김고독', profile: 'profile1' },
  //   { name: '김고독', profile: 'profile1' },
  //   { name: '김고독', profile: 'no_profile' },
  // ];

  // const customerList2 = [
  //   {
  //     '아침 5반': [
  //       { name: '김고독', profile: 'profile1' },
  //       { name: '김고독', profile: 'no_profile' },
  //       { name: '김고독', profile: 'profile1' },
  //       { name: '김고독', profile: 'profile1' },
  //       { name: '김고독', profile: 'no_profile' },
  //     ],
  //   },
  //   {
  //     '아침 6반': [
  //       { name: '김해피', profile: 'profile1' },
  //       { name: '김감자', profile: 'no_profile' },
  //       { name: '김감자', profile: 'profile1' },
  //       { name: '김감자', profile: 'profile1' },
  //       { name: '김감자', profile: 'no_profile' },
  //     ],
  //   },
  // ];

  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [isChecked, setIsChecked] = useState(false);
  // const [checkItems, setCheckItems] = useState({})

  const checkItemHandler = (e, id: number) => {
    // e.preventDefault();  // Prevent the form from submitting on checkbox change
    // console.log(id)

    checkItem(id);
    // setCheckItems(prev => ({
    //   ...prev, [id]: !prev[id]
    // }));
  };

  const checkLength = () => {
    const checkedCount = customerList.reduce((acc, group) => {
      const customers = Object.values(group)[0];
      const checkedCustomers = customers.filter((customer) => customer.check);
      return acc + checkedCustomers.length;
    }, 0);
    console.log('Checked items count:', checkedCount);
    return checkedCount;
  };

  // useEffect(() => {
  //   // console.log(checkItems)
  //   console.log(customerList)
  //   console.log(checkLength())

  // },[customerList,checkLength])

  return (
    <div className={styled.search_person}>
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
        {Object.entries(customerList).map((group, index: number) => (
          <div key={index} className={styled.group}>
            <div className={styled.group_name}>
              {Object.keys(group) && Object.keys(group[1])}
            </div>
            {Object.values(group[1]).map((customer) =>
              customer.map((item) => (
                <li key={item.id} className={styled.customer}>
                  <input
                    type="checkbox"
                    id={`item.id`}
                    onChange={(e) => checkItemHandler(e, item.id)}
                  />
                  <label className={styled.row} htmlFor={`checkbox ${item.id}`}>
                    <Image
                      src={`/assets/${item.profile}.png`}
                      alt="profile"
                      width={34}
                      height={34}
                    />
                    <div>{item.name}</div>
                  </label>
                  <div className={styled.customer_class_name}>아침 5반</div>
                </li>
              )),
            )}
          </div>
        ))}

        <div className={styled.main_btn}>
          <button
            type="button"
            disabled={checkLength() == 0}
            onClick={() => console.log('ff')}>
            {checkLength()}명 선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
