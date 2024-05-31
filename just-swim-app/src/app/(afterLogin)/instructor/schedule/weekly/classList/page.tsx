import ClassContent from './_component/tabContent/ClassContent';
import styled from './classList.module.scss';

export default function ClassList() {
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
      name: '수영 고급 연수반',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
    {
      name: '수영 고급 연수반',
      target: '지구력 위주',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#ff0000',
    },
  ];

  return (
    <>
      <div className={styled.class_list_wrapper}>
        {classList?.length > 0 ? (
          <div className={styled.class_list}>
            {classList?.map((item: any) => (
              <ClassContent key={item.name} item={item} />
            ))}
          </div>
        ) : (
          <p className={styled.empty_class}>등록된 수업이 없습니다</p>
        )}
      </div>
    </>
  );
}
