import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import calendar_icon from '/public/assets/input_icon_calendar.png';
import Image from 'next/image';

interface Props {
  bgColor?: 'gray' | 'white';
}

function calendarIcon() {
  return <Image src={calendar_icon} alt="Date picker opening icon" />;
}

export default function Datepicker({ bgColor = 'white' }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        slots={{ openPickerIcon: calendarIcon }}
        slotProps={{
          textField: { fullWidth: true },
          inputAdornment: {
            position: 'start',
          },
        }}
        sx={{
          bgcolor: `${bgColor == 'gray' ? '#F8F9FA' : 'white'}`,
          height: '51px !important',
          borderRadius: '6px',
        }}
      />
    </LocalizationProvider>
  );
}
