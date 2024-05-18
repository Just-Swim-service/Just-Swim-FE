'use client';

import './monthly.scss';
import Calendar from 'react-calendar';
import { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ClassContent from '../weekly/classList/_component/tabContent/ClassContent';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState('hidden');
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const month = date.getMonth();

  const handleShowModal = () => {
    setShowModal(true);
  };
  useEffect(() => {
    if (showModal) {
      setModalPosition('half');
    }
  }, [showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTouchStart = (e: any) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
  };

  const handleTransitionEnd = () => {
    if (modalPosition === 'hidden') {
      handleCloseModal();
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const diffY = startY.current - currentY.current;

    if (diffY > 50) {
      setModalPosition('full');
    } else if (diffY < -50) {
      setModalPosition('hidden');
    } else {
      setModalPosition('half');
    }
  };

  const week = ['월', '화', '수', '목', '금', '토', '일'];

  let classList = [
    {
      name: '아침 5 반',
      target: '초급, 배영 및 접영',
      location: '강동구 실내 수영장',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#F1554C',
      students: [
        {
          name: '김재환',
          image: '/assets/no_profile.png',
        },
        {
          name: '김혜빈',
          image: '/assets/no_profile.png',
        },
        {
          name: '박예지',
          image: '/assets/no_profile.png',
        },
      ],
    },
    {
      name: '아티스틱 스윔 반',
      target: '홍길동님 1:1 개별 코칭',
      location: '강동구 실내 수영장',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#8B41FF',
    },
    {
      name: '수영 고급 연수반1',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반2',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반3',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반4',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#ff0000',
    },
  ];

  const dayList = [
    '2024-05-10',
    '2024-05-21',
    '2024-05-05',
    '2024-05-23',
    '2024-05-27',
  ];

  // 각 날짜 타일에 컨텐츠 추가
  const addContent = ({ date }: any) => {
    // 해당 날짜(하루)에 추가할 컨텐츠의 배열
    const contents = [];

    // date(각 날짜)가 리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘) 추가

    if (
      dayList &&
      dayList?.find((day) => day === dayjs(date).format('YYYY-MM-DD'))
    ) {
      // if (dayList.find((day) => day === dayjs(date).format('YYYY-MM-DD'))) {
      contents.push(
        <>
          <div className="calender_content"></div>
        </>,
      );
    }
    return <div>{contents}</div>; // 각 날짜마다 해당 요소가 들어감
  };

  return (
    <>
      <div className="month_wrapper">
        {showModal && (
          <div
            className={`schedule_modal ${modalPosition}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTransitionEnd={handleTransitionEnd}>
            <div className="modal_header">
              <div className="bar"></div>
              <div>
                13일, <span>토</span>
              </div>
            </div>
            <div className="class_list_wrapper">
              {classList?.length > 0 ? (
                <div className="class_list">
                  {classList?.map((item: any) => (
                    <ClassContent key={item} item={item} />
                  ))}
                </div>
              ) : (
                <p className="empty_class">등록된 수업이 없습니다</p>
              )}
            </div>
          </div>
        )}
        <div className="month_and_week">
          <div className="month">
            {month + 1}월 <span>{'>'}</span>
          </div>
          <div className="week_wrapper">
            {week.map((day) => (
              // `type_button ${type === 'weekly' ? 'active' : ''}`
              <div
                className={`week ${day === '토' ? 'blue' : ''} ${day === '일' ? 'red' : ''}`}
                key={day}>
                {day}
              </div>
            ))}
          </div>
        </div>
        <Calendar
          locale="ko"
          formatDay={(_, date) => dayjs(date).format('D')}
          tileContent={addContent}
          onClickDay={handleShowModal}
        />
      </div>
      {/* {children} */}
    </>
  );
}
