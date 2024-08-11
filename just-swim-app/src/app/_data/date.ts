export const WEEK_DAYS = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
] as const;

export const DAY_KOR_TO_ENG: {[props: string]: any} = {
  "월": "monday",
  "화": "tuesday",
  "수": "wednesday",
  "목": "thursday",
  "금":  "friday",
  "토": "saturday",
  "일": "sunday",
} as const