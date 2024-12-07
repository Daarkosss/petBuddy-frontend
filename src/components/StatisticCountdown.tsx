import { Statistic } from "antd";
import { useTranslation } from "react-i18next";

const { Countdown } = Statistic;

const StatisticCountdown = () => {
  const { t } = useTranslation();

  // Calculate the time remaining until the end of the day
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Set the time to the end of the day

  const timeRemaining = endOfDay.getTime() - now.getTime(); // Calculate the time remaining

  return (
    <Countdown
      title={t("care.timeRemaining")}
      value={Date.now() + timeRemaining}
      valueStyle={{ fontSize: "18px" }}
      format="HH:mm:ss"
    />
  );
};

export default StatisticCountdown;
