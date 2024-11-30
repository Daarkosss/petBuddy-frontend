import { Input } from "antd";
import { useTranslation } from "react-i18next";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import { calendar_en, calendar_pl } from "./calendarTranslations";

interface DatePickerProps {
  handleChange: (availabilities: string[][]) => void;
  isDisabled?: boolean;
  dateValue: string[][] | undefined;
}

const MultiDatePicker: React.FC<DatePickerProps> = ({ handleChange, isDisabled=false, dateValue }) => {
  const { i18n, t } = useTranslation();

  const handleValueChange = (availabilities: DateObject[][]) => {
    handleChange(availabilities.map(
      (availability) => availability.map((date) => date.format("YYYY-MM-DD"))
    ));
  };

  return (
    <DatePicker
      value={dateValue}
      onChange={handleValueChange}
      placeholder={t("placeholder.date")}
      multiple
      range
      highlightToday
      minDate={new Date()}
      inputMode="none"
      format="YYYY-MM-DD"
      locale={i18n.language === "pl" ? calendar_pl : calendar_en}
      style={{ width: 185 }}
      plugins={[
        weekends(),
        <DatePanel
          header={t("selectedDates")}
          style={{ minWidth: 150 }}
        />
      ]}
      render={(value, openCalendar) => (
        <Input
          disabled={isDisabled}
          value={value}
          onFocus={openCalendar}
          placeholder={t("placeholder.date")}
          style={{ width: 185 }}
        />
      )}
    />
  );
};

export default MultiDatePicker;