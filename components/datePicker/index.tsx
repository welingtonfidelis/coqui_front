import { DatePickerProps, DatePicker as DatePickerAntd } from "antd";
import { RangePickerProps } from "antd/lib/date-picker/generatePicker";

interface Item {
  value: string;
  description: string;
}

const dateFormat = "DD/MM/YYYY";

export const DatePicker: React.FC<DatePickerProps> = (props) => (
  <DatePickerAntd size="large" format={dateFormat} {...props} />
);

export const RangePicker: React.FC<RangePickerProps<any>> = (props) => (
  <DatePickerAntd.RangePicker size="large" format={dateFormat} {...props} />
);
