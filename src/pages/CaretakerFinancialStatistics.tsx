import { useState, useEffect } from "react";
import { Button, Spin, Select, Input, Tooltip } from "antd";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { CareStatus } from "../types/care.types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";
import i18n from "../i18n";
import {
  calendar_en,
  calendar_pl,
} from "../components/Calendar/calendarTranslations";
import { FinancialFilters } from "../types";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip as Tt,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, Tt, Legend, CategoryScale, LinearScale);
export interface HandleFiltersChangeProps {
  filterName: string;
  filterNewValue: number | string | string[] | CareStatus[] | undefined;
}

const CaretakerFinancialStatistics = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<[string, number][]>([]);
  const [filters, setFilters] = useState<FinancialFilters>({
    animalTypes: [],
    minCareStart: "",
    maxCareStart: "",
    minDailyPrice: undefined,
    maxDailyPrice: undefined,
    emails: [],
  });
  const [datePickerValue, setDatePickerValue] = useState<Date[]>([]);

  const onEmailsChanged = (values: string[]) => {
    setFilters({
      ...filters,
      emails: values,
    });
  };

  const onDailyPriceChanged = (value: string, filterName: string) => {
    const regex = /^\d{0,5}(\.\d{0,2})?$/;
    if (value === "." || regex.test(value)) {
      setFilters({
        ...filters,
        [filterName]: value ?? 0,
      });
    }
  };

  const onDailyPriceBlur = (value: string, filterName: string) => {
    if (value.charAt(value.length - 1) === "." || value === "-") {
      value = value.slice(0, -1);
    }
    if (value.length > 1 && value.charAt(0) === "0") {
      value = value.slice(1);
    }
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const availableFilters = [
    "animalTypes",
    "minDailyPrice",
    "maxDailyPrice",
    "emails",
    "CareStart",
  ];

  useEffect(() => {
    fetchMonthlyRevenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchMonthlyRevenue = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMonthlyRevenue(filters);
      if (data) {
        setMonthlyRevenue(
          Object.entries(data.monthlyRevenue).sort(function (a, b) {
            if (a[0] > b[0]) {
              return 1;
            }
            if (a[0] < b[0]) {
              return -1;
            }
            return 0;
          })
        );
      }

      const caretakersData = await api.getRelatedUsers({
        page: 0,
        size: 1000000,
      });

      if (caretakersData) {
        setEmails([
          ...new Set(caretakersData.content.map((user) => user.email)),
        ]);
      }
    } catch (error) {
      toast.error(t("error.getCares"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyRevenue();
    store.selectedMenuOption = "profile";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDateChange = (
    dates: DateObject[],
    firstFilterName: string,
    secondFilterName: string
  ) => {
    if (dates.length === 1) {
      setFilters({
        ...filters,
        minCareStart: dates[0].toString(),
        maxCareStart: "",
      });
    } else {
      if (dates.length === 2) {
        setFilters({
          ...filters,
          [firstFilterName]: dates[0].toString(),
          [secondFilterName]: dates[1].toString(),
        });
      } else {
        setFilters({
          ...filters,
          [firstFilterName]: "",
          [secondFilterName]: "",
        });
      }
    }
  };

  useEffect(() => {
    const dates = [];
    if (filters.minCareStart) dates.push(new Date(filters.minCareStart));
    if (filters.maxCareStart) dates.push(new Date(filters.maxCareStart));
    setDatePickerValue(dates);
  }, [filters]);

  const renderMonthlyRevenueFilters = () => {
    return availableFilters.map((filterName, index) => {
      switch (filterName) {
        case "CareStart":
          return (
            <div className="calendar-wrapper" key={filterName}>
              <h3>{t(`careSearch.${filterName}`)}</h3>
              <DatePicker
                format="YYYY-MM"
                maxDate={new Date()}
                onlyMonthPicker
                key={filterName}
                value={datePickerValue}
                onChange={(dates) =>
                  onDateChange(dates, `min${filterName}`, `max${filterName}`)
                }
                locale={i18n.language === "pl" ? calendar_pl : calendar_en}
                range
                plugins={[highlightWeekends()]}
                render={(value, openCalendar) => (
                  <Tooltip
                    className="revenue-date"
                    trigger={["focus"]}
                    title={t(`careSearch.${filterName}`)}
                  >
                    <Input
                      value={value}
                      allowClear
                      onClear={() => {
                        setFilters({
                          ...filters,
                          [`min${filterName}`]: "",
                          [`max${filterName}`]: "",
                        });
                      }}
                      onFocus={openCalendar}
                      placeholder={t("placeholder.date")}
                    />
                  </Tooltip>
                )}
              />
            </div>
          );
        case "animalTypes":
          return (
            <Select
              key={`at${index}`}
              className="revenues-filters"
              mode="multiple"
              allowClear
              placeholder={t(`careSearch.${filterName}`)}
              onSelect={(value) => {
                const newValues = [...filters[filterName], value];
                setFilters({
                  ...filters,
                  [filterName]: newValues,
                });
              }}
              onDeselect={(value: string) =>
                setFilters({
                  ...filters,
                  [filterName]: filters[filterName].filter(
                    (val) => val !== value
                  ),
                })
              }
              onClear={() =>
                setFilters({
                  ...filters,
                  [filterName]: [],
                })
              }
            >
              {store.animal.allAnimalTypes.map((animalType, indexAnimals) => (
                <Select.Option key={`ant${indexAnimals}`} value={animalType}>
                  {t(`animalTypes.${animalType}`)}
                </Select.Option>
              ))}
            </Select>
          );

        case "minDailyPrice":
        case "maxDailyPrice":
          return (
            <Tooltip
              key={`dpT${index}`}
              trigger={["focus"]}
              title={t(`careSearch.${filterName}`)}
            >
              <Input
                key={`dp${index}`}
                addonAfter={`zł ${filterName.substring(0, 3)}`}
                className="revenue-daily-price"
                placeholder={t(`careSearch.${filterName}`)}
                value={filters[filterName] ?? undefined}
                onChange={(e) =>
                  onDailyPriceChanged(e.target.value, filterName)
                }
                onBlur={(e) => onDailyPriceBlur(e.target.value, filterName)}
              />
            </Tooltip>
          );

        case "emails":
          return (
            <div key={`emd${index}`} className="revenue-emails">
              <Tooltip
                key="emT"
                trigger={["focus"]}
                title={t(
                  `careSearch.${filterName}${store.user.profile?.selected_profile}`
                )}
              >
                <Select
                  notFoundContent={t("noData")}
                  showSearch
                  allowClear
                  mode="multiple"
                  placeholder={t(
                    `careSearch.${filterName}${store.user.profile?.selected_profile}`
                  )}
                  filterOption={(searchedInput, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(searchedInput.toLowerCase())
                  }
                  options={emails.map((email) => ({
                    value: email,
                    label: email,
                  }))}
                  onChange={(value) => onEmailsChanged(value)}
                />
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    });
  };
  return (
    <div className="revenue-main-container">
      <div className="revenue-sidebar">
        <h2>{t("filters")}</h2>
        <div className="filters">
          {renderMonthlyRevenueFilters()}
          <Button
            type="primary"
            onClick={() => fetchMonthlyRevenue()}
            className="search-button"
          >
            {t("search")}
          </Button>
        </div>
      </div>
      <div className="revenue-container">
        <Spin spinning={isLoading} fullscreen />
        <h1 className="revenue-title">{t("yourRevenue")}</h1>
        {Object.keys(monthlyRevenue).length > 0 ? (
          <div className="revenue-plot-sum-container">
            <div className="revenue-plot-background">
              <Bar
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                }}
                className="revenue-plot"
                data={{
                  labels: monthlyRevenue.map((entry) => entry[0]),
                  datasets: [
                    {
                      label: t("revenue"),
                      data: monthlyRevenue.map((entry) => entry[1]),
                    },
                  ],
                }}
              />
            </div>
            <div className="revenue-sum">
              <h3>
                {t("revenueSum")}{" "}
                {monthlyRevenue
                  .map((entry) => entry[1])
                  .reduce((acc, value) => acc + value)}{" "}
                zł
              </h3>{" "}
            </div>
          </div>
        ) : (
          <h2 className="no-cares">{t("noRevenueData")}</h2>
        )}
      </div>
    </div>
  );
};

export default CaretakerFinancialStatistics;
