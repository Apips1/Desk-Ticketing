import { CalendarDate, parseDate } from "@internationalized/date";
import { DatePicker, InputProps, DatePickerProps } from "@nextui-org/react";
import dayjs from "dayjs";

interface Props
  extends InputProps,
    Pick<DatePickerProps, "minValue" | "maxValue"> {}

const InputDatePicker: React.FC<Props> = (props) => {
  const { value, onValueChange, validate, defaultValue, onChange, ...rest } =
    props;

  const [date, setDate] = useState<CalendarDate>();

  const handleChange = (value: any) => {
    const date = dayjs(value).format("YYYY-MM-DD");
    if (onValueChange) onValueChange(date);
  };

  useEffect(() => {
    if (value) setDate(parseDate((value as string).slice(0, 10)));
  }, [value]);

  return (
    <>
      <DatePicker
        showMonthAndYearPickers
        value={date}
        onChange={handleChange}
        granularity="day"
        {...rest}
      ></DatePicker>
    </>
  );
};

export default InputDatePicker;
