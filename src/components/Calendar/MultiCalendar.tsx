import { useTranslation } from "react-i18next";
import { Calendar, DateObject } from "react-multi-date-picker";
import DatePanel, {
  DatePanelProps,
} from "react-multi-date-picker/plugins/date_panel";
import { calendar_en, calendar_pl } from "./calendarTranslations";
import { AvailabilityValues } from "../../types";

interface CalendarProps {
  dateValue: string[][] | undefined;
  handleChange?: (availabilities: AvailabilityValues) => void;
  readOnly?: boolean;
  datePanelPosition?: DatePanelProps["position"];
  showRemoveButton?: boolean;
}

const MultiCalendar: React.FC<CalendarProps> = ({
  dateValue,
  handleChange,
  readOnly = false,
  datePanelPosition = "right",
  showRemoveButton = true,
}) => {
  const { i18n, t } = useTranslation();

  const handleValueChange = (availabilities: DateObject[][]) => {
    if (handleChange) {
      handleChange(
        availabilities.map((availability) =>
          availability.map((date) => date.format("YYYY-MM-DD"))
        )
      );
    }
  };

  return (
    <Calendar
      value={dateValue}
      multiple
      range
      readOnly={readOnly}
      format="YYYY-MM-DD"
      locale={i18n.language === "pl" ? calendar_pl : calendar_en}
      onChange={handleValueChange}
      minDate={new DateObject().add(1, "days")} // Tomorrow
      plugins={[
        <DatePanel
          header={
            showRemoveButton === true ? t("selectedDates") : t("availableDates")
          }
          position={datePanelPosition}
          style={{ minWidth: 150 }}
          removeButton={showRemoveButton}
        />,
      ]}
    />
  );
};

export default MultiCalendar;
