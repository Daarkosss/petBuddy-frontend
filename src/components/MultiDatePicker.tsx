import { Input } from "antd";
import { useTranslation } from "react-i18next";
import DatePicker, { Value } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";

const calendar_pl = {
  name: "polish",
  months: [
    ["Styczeń", "Sty"],
    ["Luty", "Lut"],
    ["Marzec", "Mar"],
    ["Kwiecień", "Kwi"],
    ["Maj", "Maj"],
    ["Czerwiec", "Cze"],
    ["Lipiec", "Lip"],
    ["Sierpień", "Sie"],
    ["Wrzesień", "Wrz"],
    ["Październik", "Paź"],
    ["Listopad", "Lis"],
    ["Grudzień", "Gru"],
  ],
  weekDays: [
    ["Poniedziałek", "Nie"],
    ["Wtorek", "Pon"],
    ["Środa", "Wto"],
    ["Czwartek", "Śro"],
    ["Piątek", "Czw"],
    ["Sobota", "Pią"],
    ["Niedziela", "Sob"],
  ],
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["Przed południem", "przed południem"],
    ["Po południu", "po południu"],
  ],
};

const calendar_en = {
  name: "gregorian_en",
  months: [
    ["January", "Jan"],
    ["February", "Feb"],
    ["March", "Mar"],
    ["April", "Apr"],
    ["May", "May"],
    ["June", "Jun"],
    ["July", "Jul"],
    ["August", "Aug"],
    ["September", "Sep"],
    ["October", "Oct"],
    ["November", "Nov"],
    ["December", "Dec"],
  ],
  weekDays: [
    ["Saturday", "Sat"],
    ["Sunday", "Sun"],
    ["Monday", "Mon"],
    ["Tuesday", "Tue"],
    ["Wednesday", "Wed"],
    ["Thursday", "Thu"],
    ["Friday", "Fri"],
  ],
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["AM", "am"],
    ["PM", "pm"],
  ],
};

interface DatePickerProps {
  handleChange: (availabilities: Value[][]) => void;
  isDisabled: boolean;
  dateValue: string[][] | undefined;
}

const MultiDatePicker: React.FC<DatePickerProps> = ({ handleChange, isDisabled, dateValue }) => {
  const { i18n, t } = useTranslation();

  return (
    <DatePicker
      value={dateValue}
      disabled={isDisabled}
      onChange={handleChange}
      placeholder={t("placeholder.date")}
      multiple
      range
      inputMode="none"
      format="YYYY-MM-DD"
      locale={i18n.language === "pl" ? calendar_pl : calendar_en}
      style={{ width: 185 }}
      plugins={[
        weekends(),
        <DatePanel sort="date" style={{ width: 150 }} />
      ]}
      render={(value, openCalendar) => (
        <Input
          value={value}
          className="ant-input"
          onFocus={openCalendar}
          placeholder={t("placeholder.date")}
          style={{ width: 185 }}
        />
      )}
    />
  );
}

export default MultiDatePicker;