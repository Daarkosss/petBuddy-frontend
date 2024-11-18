import { Statistic } from "antd";

const { Countdown } = Statistic;

const CountdownToEndOfDay = () => {
  // Oblicz czas do końca dzisiejszego dnia
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Ustaw koniec dnia na 23:59:59.999

  const timeRemaining = endOfDay.getTime() - now.getTime(); // Różnica w milisekundach

  return (
    <Countdown
      title="Pozostały czas"
      value={Date.now() + timeRemaining} // Ustaw wartość końcową
      format="HH:mm:ss" // Formatowanie w godzinach, minutach i sekundach
    />
  );
};

export default CountdownToEndOfDay;
