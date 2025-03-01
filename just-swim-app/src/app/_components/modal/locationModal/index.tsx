'use client';

import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';

import { ConfirmButton, Portal } from '@components';
import { IconCheck, IconSearch, ImageArrowBack } from '@assets';
import { randomId } from '@utils';

import styled from './styles.module.scss';

const locationCache = new Map<string, { name: string; location: string }[]>();

async function getLocationList(query: string) {
  if (!query) return [];

  if (locationCache.has(query)) {
    return locationCache.get(query)!;
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error('위치 검색 실패');
      return [];
    }

    const data = await response.json();
    const locations = data.documents.map((doc: any) => ({
      name: doc.place_name,
      location: doc.road_address_name || doc.address_name,
    }));

    locationCache.set(query, locations);

    return locations;
  } catch (error) {
    console.error('location API 요청 중 오류 발생', error);
    return [];
  }
}

function LocationListItem({
  location,
  selected,
  setSelected,
}: {
  location: {
    name: string;
    location: string;
  };
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) {
  const onClickItem = () => {
    setSelected(location.name);
  };

  return (
    <div className={styled.list_item} onClick={onClickItem}>
      <div
        className={`${styled.check_box} ${selected === location.name && styled.selected}`}>
        <IconCheck />
      </div>
      <div className={styled.text_wrapper}>
        <p className={styled.name}>{location.name}</p>
        <p className={styled.location}>{location.location}</p>
      </div>
    </div>
  );
}

export function LocationModal({
  title = '수업 등록하기',
  location,
  selectLocation,
  hideModal,
  unshowModal,
}: {
  title?: string;
  location?: string;
  selectLocation: (location: string) => void;
  hideModal: (event: MouseEvent<HTMLElement>) => void;
  unshowModal: () => void;
}) {
  const [selected, setSelected] = useState('');
  const [input, setInput] = useState('');
  const [locationList, setLocationList] = useState<
    { name: string; location: string }[]
  >([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onClickBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    unshowModal();
  };

  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    selectLocation(selected);
    unshowModal();
  };

  useEffect(() => {
    let isMounted = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (input.trim() === '') {
        setLocationList([]);
        return;
      }

      const locations = await getLocationList(input);
      if (isMounted) {
        setLocationList(locations);
      }
    }, 300);

    return () => {
      isMounted = false;
    };
  }, [input]);

  useEffect(() => {
    if (location) {
      setSelected(location);
    }
  }, [location]);

  return (
    <Portal>
      <div className={styled.container}>
        <div className={styled.header}>
          <div className={styled.title_wrapper}>
            <button onClick={onClickBack}>
              <Image src={ImageArrowBack} alt="뒤로가기" />
            </button>
            <p>{title}</p>
          </div>
        </div>
        <div>
          <div className={styled.search_wrapper}>
            <div className={styled.icon_wrapper}>
              <IconSearch width={22} height={22} />
            </div>
            <input
              className={styled.search_input}
              type="text"
              placeholder="수업 장소 검색"
              value={input}
              onChange={onChangeInput}
            />
          </div>
          <div className={styled.location_list}>
            {locationList.map((location) => {
              return (
                <LocationListItem
                  key={randomId()}
                  location={location}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            })}
          </div>
          <div className={styled.button_wrapper}>
            <ConfirmButton
              kind="confirm"
              text="선택하기"
              active={!!selected}
              onClick={onClickButton}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
}
