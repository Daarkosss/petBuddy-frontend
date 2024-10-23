import { Input } from "antd";
import { useTranslation } from "react-i18next";
import DatePicker, { Value } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import { calendar_en, calendar_pl } from "./calendarTranslations";

interface DatePickerProps {
  handleChange: (availabilities: Value[][]) => void;
  isDisabled?: boolean;
  dateValue: string[][] | Value[][] |undefined;
}

const MultiDatePicker: React.FC<DatePickerProps> = ({ handleChange, isDisabled=false, dateValue }) => {
  const { i18n, t } = useTranslation();

  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
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
          style={{ width: 150 }}
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
}

export default MultiDatePicker;