import { useTranslation } from "react-i18next";
import { Calendar, DateObject, Value } from "react-multi-date-picker"
import DatePanel, { DatePanelProps } from "react-multi-date-picker/plugins/date_panel"
import { calendar_en, calendar_pl } from "./calendarTranslations";

interface CalendarProps {
  dateValue: Value[][] | undefined;
  handleChange?: (availabilities: Value[][]) => void;
  readOnly?: boolean;
  datePanelPosition?: DatePanelProps["position"];
}

const MultiCalendar: React.FC<CalendarProps> = ({
  dateValue, handleChange, readOnly=false, datePanelPosition="right"
}) => {
  const { i18n, t } = useTranslation();

  return (
    <Calendar
      value={dateValue}
      multiple
      range
      readOnly={readOnly}
      format="YYYY-MM-DD"
      locale={i18n.language === "pl" ? calendar_pl : calendar_en}
      onChange={handleChange}
      minDate={new DateObject().add(1, "days")} // Tomorrow
      plugins={[
        <DatePanel header={t("selectedDates")} position={datePanelPosition}/>]}
    />
  )
}

export default MultiCalendar;
