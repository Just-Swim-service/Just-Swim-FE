export interface ColorPickerProps {
  selected: string,
  change: (color: string) => void,
}

export interface DatePickerProps {
  selectedDate: string,
  changeSelectedDate: (date: string) => void,
}

export interface TimePickerProps {
  value: string,
  updateValue: (time: string) => void,
}

export interface MonthPickerProps {
  yearValue: number,
  monthValue: number,
  updateValue: ({ year, month }: { year: number, month: number }) => void,
}