import Calendar from '@assets/calendar.svg';

interface Props {
  width: number;
  height: number;
}

export default function CalendarSVG({ width, height }: Props) {
  return <Calendar width={width} height={height} />;
}

// const CalendarSVG = () => {
//   return <Calendar />;
// };
// export default CalendarSVG;
