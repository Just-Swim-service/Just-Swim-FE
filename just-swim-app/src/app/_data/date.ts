export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const WEEK_DAYS_TO_ENG = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAY_KOR_TO_ENG = {
  월: 'monday',
  화: 'tuesday',
  수: 'wednesday',
  목: 'thursday',
  금: 'friday',
  토: 'saturday',
  일: 'sunday',
} as const;

export const DAY_ENG_TO_KOR = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일',
} as const;
