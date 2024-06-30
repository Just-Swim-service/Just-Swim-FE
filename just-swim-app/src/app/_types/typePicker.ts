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
  setValue: (time: string) => void,
  itemHeight?: number,
  itemsToShow?: number,
  paddingY?: number,
}