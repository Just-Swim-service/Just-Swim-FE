import { Calendar, CalendarItem } from '@components';
import { DatePickerProps } from '@types';

import styled from './styles.module.scss';

export function DatePicker({
  selectedDate,
  changeSelectedDate
}: DatePickerProps) {
  return (
    <div className={styled.date_picker}>
      <Calendar
        DateBlock={CalendarItem}
        selectedDate={selectedDate}
        changeSelectedDate={changeSelectedDate}
      />
    </div>
  )
}