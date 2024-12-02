import { Input } from "antd";
import { useTranslation } from "react-i18next";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { calendar_en, calendar_pl } from "./calendarTranslations";

interface DatePickerProps {
  handleChange: (availabilities: string[]) => void;
  dateValue: string[] | undefined;
  availabilities: string[][];
  availabilityRange: string[] | null;
  setAvailabilityRange: (range: string[] | null) => void;
}

const RestrictedDatePicker: React.FC<DatePickerProps> = ({ 
  handleChange, dateValue, availabilities, availabilityRange, setAvailabilityRange
}) => {
  const { i18n, t } = useTranslation();

  const isDateInRange = (date: string, range: string[]) => {
    const start = new Date(range[0]);
    const end = new Date(range[1]);
    const currentDate = new Date(date);

    return currentDate >= start && currentDate <= end;
  };

  const findRangeForDate = (date: string) => {
    return availabilities.find((range) => isDateInRange(date, range));
  };

  const handleDateChange = (range: DateObject[]) => {
    const convertedRange = range.map((date) => date.format("YYYY-MM-DD"));
    const startDate = convertedRange[0];
    const endDate = convertedRange[1];

    if (startDate) {
      const validRange = findRangeForDate(startDate);
      if (validRange) {
        setAvailabilityRange(validRange);
        if (!endDate || !isDateInRange(endDate, validRange)) {
          handleChange([startDate]);
        } else {
          handleChange([startDate, endDate]);
        }
      } else {
        handleChange([]);
      }
    } else {
      handleChange([]);
      setAvailabilityRange(null);
    }
    if (endDate) {
      setAvailabilityRange(null);
    }
  };

  return (
    <DatePicker
      format="YYYY-MM-DD"
      range
      value={dateValue}
      locale={i18n.language === "pl" ? calendar_pl : calendar_en}
      minDate={new DateObject().add(1, "days")}
      currentDate={new DateObject(availabilities[0][0])}
      onChange={handleDateChange}
      style={{ width: 185 }}
      mapDays={({ date }) => {
        const formattedDate = date.format("YYYY-MM-DD");
        const inAllowedRange = availabilityRange 
          ? isDateInRange(formattedDate, availabilityRange)
          : availabilities.some((range) => isDateInRange(formattedDate, range));

        return {
          disabled: !inAllowedRange,
          style: !inAllowedRange ? { color: "#d9d9d9" } : {},
        };
      }}
      render={(value, openCalendar) => (
        <Input
          value={value}
          onFocus={openCalendar}
          placeholder={t("placeholder.date")}
          style={{ width: 185 }}
        />
      )}
    />
  );
};

export default RestrictedDatePicker;