import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Datepicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          bgcolor: 'white',
        }}
      />
      {/* <DatePicker /> */}
    </LocalizationProvider>
  );
}
