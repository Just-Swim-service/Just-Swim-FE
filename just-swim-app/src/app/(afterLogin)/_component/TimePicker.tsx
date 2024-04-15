import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

interface TimepickerProps {
  label: string;
}

export default function Timepicker({ label }: TimepickerProps) {
  let date = new Date();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <TimePicker label={label} ampm defaultValue={dayjs(date)} />
    </LocalizationProvider>
  );
}
