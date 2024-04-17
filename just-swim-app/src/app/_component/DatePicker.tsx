import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
  bgColor?: 'gray' | 'white';
}
export default function Datepicker({ bgColor = 'white' }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          bgcolor: `${bgColor == 'gray' ? '#F8F9FA' : 'white'}`,
          height: '51px !important',
        }}
      />
      {/* <DatePicker /> */}
    </LocalizationProvider>
  );
}
