'use client';

import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { MemberProps } from "./server";
import IconSearch from './icon_search.svg';
import IconDown from './icon_down.svg';
import IconCheckSmall from './icon_check_small.svg';

import { searchUserStore } from "@store";
import { randomId } from "@utils";

import styled from './styles.module.scss';

function _MemberItem({
  member,
  setSelected,
  defaultSelected
}: {
  member: MemberProps,
  setSelected: Dispatch<SetStateAction<MemberProps[]>>,
  defaultSelected: boolean,
}) {
  // 현재 수강생 선택 여부
  const [itemSelected, setItemSelected] = useState<boolean>(defaultSelected);

  // 현재 수강생 선택 여부 변경
  const onClickMember = () => {
    setItemSelected(s => !s);
  }

  // 현재 수강생 선택 여부가 변경될때마다
  useEffect(() => {
    if (itemSelected) {
      // 선택이라면 기존 배열에 추가
      setSelected(prev => {
        const result = [...prev];

        for (const m of result) {
          if (m.lectureTitle === member.lectureTitle && m.memberId === member.memberId) {
            return result;
          }
        }
        
        result.push(member);
        
        return result;
      })
    } else {
      // 삭제라면 기존 배열에서 삭제
      setSelected(prev => {
        const result = [];

        for (const item of prev) {
          if (item.lectureTitle === member.lectureTitle && item.memberId === member.memberId) {
            continue;
          }

          result.push(item);
        }

        return result;
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSelected]);

  return (
    <button onClick={onClickMember} className={styled.member_item}>
      <div className={`${styled.check_box} ${itemSelected && styled.selected}`}>
        {
          itemSelected &&
          <IconCheckSmall />
        }
      </div>
      <div className={styled.image_wrapper}>
        {
          // 하드코딩 된 부분, 추후 수정 필요
          member.profileImage.startsWith('http')
          ?
          <Image src={member.profileImage} alt={member.memberNickname} width={34} height={34} />
          :
          <div className={styled.empty_image} />
        }
      </div>
      <p className={styled.name}>{member.memberNickname}</p>
      <div className={styled.lecture}>
        <p>{member.lectureTitle}</p>
      </div>
    </button>
  )
}

const MemberItem = React.memo(_MemberItem);

function _GroupList({
  group,
  reverse,
  search,
  setSelected,
  defaultList
}: {
  group: { lecture: string, members: MemberProps[] }[],
  reverse: boolean,
  search: string,
  setSelected: Dispatch<SetStateAction<MemberProps[]>>,
  defaultList: MemberProps[],
}) {
  let list = group;

  // 배열 뒤집기
  if (reverse) {
    list = [...list].reverse();
  }

  return (
    <div className={styled.group_list}>
      {
        list.map(g => {
          // 현재 강의에서, 검색어를 포함하는 수강생 확인
          const members = [];

          for (const m of g.members) {
            if (m.memberNickname.includes(search)) {
              members.push(m);
            }
          }

          if (members.length === 0) {
            // 검색어를 포함하는 수강생이 없으면 현재 강의명도 출력하지 않음
            return null;
          } else {
            // 검색어를 포함하는 수강생이 한명이라도 있으면 강의명과 수강생 출력
            return (
              <div key={randomId()}>
                <p className={styled.title}>{g.lecture}</p>
                {
                  members.map(m => {
                    let flag = false;

                    for (const def of defaultList) {
                      if (def.memberId === m.memberId) {
                        flag = true;
                      }
                    }

                    return (
                      <MemberItem key={randomId()} member={m} setSelected={setSelected} defaultSelected={flag} />
                    )
                  })
                }
              </div>
            )
          }
        })
      }
    </div>
  )
}

const GroupList = React.memo(_GroupList);

function _NameList({
  name,
  reverse,
  search,
  setSelected,
  defaultList
}: {
  name: MemberProps[],
  reverse: boolean,
  search: string,
  setSelected: Dispatch<SetStateAction<MemberProps[]>>,
  defaultList: MemberProps[],
}) {
  let list = name;

  // 배열 뒤집기
  if (reverse) {
    list = [...list].reverse();
  }

  return (
    <div className={styled.name_list}>
      {
        list.map(member => {
          if (member.memberNickname.includes(search)) {
            let flag = false;

            for (const def of defaultList) {
              if (def.memberId === member.memberId) {
                flag = true;
              }
            }
            
            // 검색어를 포함하는 수강생만 출력
            return (
              <MemberItem key={randomId()} member={member} setSelected={setSelected} defaultSelected={flag} />
            )
          } else {
            return null;
          }
        })
      }
    </div>
  )
}

const NameList = React.memo(_NameList);

export function Search({
  group,
  name,
}: {
  group: { lecture: string, members: MemberProps[] }[],
  name: MemberProps[],
}) {
  // member store
  const {
    selectedList,
    updateSelectedList,
  } = searchUserStore();

  const router = useRouter();

  // 수업 / 이름 타입
  const [type, setType] = useState<'group' | 'name'>('group');
  // 검색어
  const [search, setSearch] = useState<string>('');
  // 오름차순 여부
  const [reverse, setReverse] = useState<boolean>(false);
  // 선택된 수강생
  const [selected, setSelected] = useState<MemberProps[]>([]);

  // input 이벤트 핸들러
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  // 이 부분은 크게 신경 쓰지 않아도 됨
  // 타입 선택의 우선순위를 미뤄주는 부분
  const [_, startTransition] = useTransition();

  // 타입을 설정하는 부분
  const onClickSelectType = (type: 'group' | 'name') => {
    startTransition(() => {
      setType(type);
    });
  }

  // 오름차순, 내림차순 여부
  const toggleReverse = () => {
    setReverse(s => !s);
  }

  // 타입이 변경될 때 오름차순으로 초기화, 선택된 수강생 삭제
  useEffect(() => {
    setReverse(false);
    setSelected([...selectedList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // 여기에 선택하기 버튼을 눌렀을 때 처리해야 할 동작 추가
  const onClickSelect = () => {
    // 선택 관련 로직 처리

    // console.table(selected);
    updateSelectedList(selected);
    router.push('/feedback/create/person');
  }

  return (
    <div className={styled.container}>
      <div className={styled.header}>
        <div className={styled.type}>
          <button className={`${styled.select} ${type === 'group' && styled.selected}`} onClick={() => { onClickSelectType("group") }}>
            <span>수업별로 보기</span>
          </button>
          <button className={`${styled.select} ${type === 'name' && styled.selected}`} onClick={() => { onClickSelectType("name") }}>
            <span>이름순으로 보기</span>
          </button>
        </div>
        <div className={styled.search}>
          <div className={styled.icon}>
            <IconSearch />
          </div>
          <input 
            className={styled.input}
            type="text"
            onChange={onChangeInput}
            value={search}
            placeholder="수강생 이름으로 검색"
          />
        </div>
      </div>
      <div className={styled.info}>
        <p>{type === 'group' ? '수업명' : '이름'}</p>
        <button className={`${styled.button} ${reverse && styled.reverse}`} onClick={toggleReverse}>
          <span>{reverse ? '내림차순' : '오름차순'}</span>
          <IconDown />
        </button>
      </div>
      {
        type === 'group' ?
        <GroupList group={group} reverse={reverse} search={search} setSelected={setSelected} defaultList={selectedList} /> :
        <NameList name={name} reverse={reverse} search={search} setSelected={setSelected} defaultList={selectedList} />
      }
      <div className={styled.button_container}>
        <button className={`${styled.button} ${selected.length === 0 ? styled.disable : styled.active}`} disabled={selected.length === 0} onClick={onClickSelect}>
          {
            selected.length !== 0 &&
            <span>{`${selected.length}명 `}</span>
          }
          <span>선택하기</span>
        </button>
      </div>
    </div>
  )
}