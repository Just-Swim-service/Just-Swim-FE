import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Repeat from '@assets/repeat.svg';

interface Props {
  bgColor?: 'gray' | 'white';
}

function repeatIcon() {
  return <Repeat width={20} height={20} />;
}

export default function RepeatDatepicker({ bgColor = 'white' }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        slots={{ openPickerIcon: repeatIcon }}
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
