'use client';

import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useState,
  useTransition,
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { MemberProps } from './server';
import IconSearch from './icon_search.svg';
import IconDown from './icon_down.svg';
import IconCheckSmall from './icon_check_small.svg';

import { searchUserStore } from '@store';
import { randomId } from '@utils';

import styled from './styles.module.scss';
import { Header } from '@components';
import { usePerformance } from '@hooks';

function _MemberItem({
  member,
  setSelected,
  defaultSelected,
}: {
  member: MemberProps;
  setSelected: Dispatch<SetStateAction<MemberProps[]>>;
  defaultSelected: boolean;
}) {
  // 현재 수강생 선택 여부
  const [itemSelected, setItemSelected] = useState<boolean>(defaultSelected);

  // 현재 수강생 선택 여부 변경
  const onClickMember = useCallback(() => {
    setItemSelected((s) => !s);
  }, []);

  // 현재 수강생 선택 여부가 변경될 때마다
  useEffect(() => {
    setSelected((prev) => {
      const exists = prev.some(
        (item) =>
          item.lectureTitle === member.lectureTitle &&
          item.memberId === member.memberId,
      );

      if (itemSelected && !exists) {
        return [...prev, member]; // 새 멤버 추가
      } else if (!itemSelected && exists) {
        return prev.filter(
          (item) =>
            !(
              item.lectureTitle === member.lectureTitle &&
              item.memberId === member.memberId
            ),
        ); // 멤버 제거
      }

      return prev; // 상태 변경 없음
    });
  }, [itemSelected, member, setSelected]);

  return (
    <div className={styled.member_item} onClick={onClickMember}>
      <div
        className={`${styled.check_box} ${itemSelected ? styled.selected : ''}`}>
        {itemSelected && <IconCheckSmall />}
      </div>
      <div className={styled.image_wrapper}>
        <Image
          src={member.profileImage || '/assets/no_profile.png'}
          alt="프로필 이미지"
          width={40}
          height={40}
        />
      </div>
      <div className={styled.member_info}>
        <div className={styled.name}>{member.memberNickname}</div>
        <div className={styled.lecture}>{member.lectureTitle}</div>
      </div>
    </div>
  );
}

const MemberItem = React.memo(_MemberItem);

function _GroupList({
  group,
  reverse,
  search,
  setSelected,
  defaultList,
}: {
  group: { lecture: string; members: MemberProps[] }[] | null;
  reverse: boolean;
  search: string;
  setSelected: Dispatch<SetStateAction<MemberProps[]>>;
  defaultList: MemberProps[];
}) {
  if (!group) return null;

  let list = [...group];

  if (reverse) {
    list = [...list].reverse();
  }

  return (
    <div className={styled.group_list}>
      {list.map((groupItem) => {
        const filteredMembers = groupItem.members.filter((member) =>
          member.memberNickname.includes(search),
        );

        if (filteredMembers.length === 0) return null;

        return (
          <div key={randomId()} className={styled.group_item}>
            <div className={styled.group_title}>{groupItem.lecture}</div>
            <div className={styled.member_list}>
              {filteredMembers.map((member) => {
                let flag = false;

                for (const def of defaultList) {
                  if (def.memberId === member.memberId) {
                    flag = true;
                  }
                }

                return (
                  <MemberItem
                    key={randomId()}
                    member={member}
                    setSelected={setSelected}
                    defaultSelected={flag}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const GroupList = React.memo(_GroupList);

function _NameList({
  name,
  reverse,
  search,
  setSelected,
  defaultList,
}: {
  name: MemberProps[];
  reverse: boolean;
  search: string;
  setSelected: Dispatch<SetStateAction<MemberProps[]>>;
  defaultList: MemberProps[];
}) {
  if (!name) return null;

  let list = [...name];

  if (reverse) {
    list = [...list].reverse();
  }

  return (
    <div className={styled.name_list}>
      {list.map((member) => {
        if (member.memberNickname.includes(search)) {
          let flag = false;

          for (const def of defaultList) {
            if (def.memberId === member.memberId) {
              flag = true;
            }
          }

          // 검색어를 포함하는 수강생만 출력
          return (
            <MemberItem
              key={randomId()}
              member={member}
              setSelected={setSelected}
              defaultSelected={flag}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

const NameList = React.memo(_NameList);

export default function Search() {
  const router = useRouter();
  const {
    processedData,
    loadUserList,
    checkedList,
    checkItemHandler,
    selectedList,
    updateSelectedList,
    isLoading,
  } = searchUserStore();
  const { renderCount } = usePerformance('SearchPage');

  const [type, setType] = useState<'group' | 'name'>('group');
  const [search, setSearch] = useState<string>('');
  const [reverse, setReverse] = useState<boolean>(false);
  const [selected, setSelected] = useState<MemberProps[]>([]);

  // 캐시된 데이터 사용
  const { userNameList, groupNameList } = useMemo(() => {
    return processedData || { userNameList: [], groupNameList: [] };
  }, [processedData]);

  useEffect(() => {
    loadUserList();
  }, [loadUserList]);

  // 타입이 변경될 때 오름차순으로 초기화, 선택된 수강생 삭제
  useEffect(() => {
    setReverse(false);
    setSelected(selectedList);
  }, [type, selectedList]);

  // input 이벤트 핸들러
  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  // 타입 선택의 우선순위를 미뤄주는 부분
  const [_, startTransition] = useTransition();

  // 타입을 설정하는 부분
  const onClickSelectType = useCallback((newType: 'group' | 'name') => {
    startTransition(() => {
      setType(newType);
    });
  }, []);

  // 오름차순, 내림차순 여부
  const toggleReverse = useCallback(() => {
    setReverse((s) => !s);
  }, []);

  // 선택된 수강생을 store에 저장
  const handleSelect = useCallback(() => {
    updateSelectedList(selected);
  }, [selected, updateSelectedList]);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <>
        <Header title="수강생 선택" />
        <div className={styled.container}>
          <div className={styled.loading}>데이터를 불러오는 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="수강생 선택" />
      <div className={styled.container}>
        <p className={styled.title}>
          전체 피드백을 남길 <br />
          수강생을 선택해주세요
        </p>
        <div className={styled.header}>
          <div className={styled.type}>
            <button
              className={`${styled.select} ${type === 'group' && styled.selected}`}
              onClick={() => onClickSelectType('group')}>
              <span>수업별로 보기</span>
            </button>
            <button
              className={`${styled.select} ${type === 'name' && styled.selected}`}
              onClick={() => onClickSelectType('name')}>
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
          <button
            className={`${styled.button} ${reverse && styled.reverse}`}
            onClick={toggleReverse}>
            <span>{reverse ? '내림차순' : '오름차순'}</span>
            <IconDown />
          </button>
        </div>
        {type === 'group' ? (
          <GroupList
            group={groupNameList}
            reverse={reverse}
            search={search}
            setSelected={setSelected}
            defaultList={selectedList}
          />
        ) : (
          <NameList
            name={userNameList}
            reverse={reverse}
            search={search}
            setSelected={setSelected}
            defaultList={selectedList}
          />
        )}
        <div className={styled.button_container}>
          <Link
            href="/feedback/create/person"
            onClick={handleSelect}
            prefetch={true}
            className={`${styled.button} ${selected.length === 0 ? styled.disable : styled.active}`}
            style={{ pointerEvents: selected.length === 0 ? 'none' : 'auto' }}>
            {selected.length !== 0 && <span>{`${selected.length}명 `}</span>}
            <span>선택하기</span>
          </Link>
        </div>
      </div>
    </>
  );
}
