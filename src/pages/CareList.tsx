import { useState, useEffect } from "react";
import {
  List,
  Button,
  Spin,
  Descriptions,
  Badge,
  Select,
  Input,
  Tooltip,
} from "antd";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Care } from "../models/Care";
import UserInfoPill from "../components/UserInfoPill";
import { CareSearchFilters, CareStatus } from "../types/care.types";
import { FilterOutlined } from "@ant-design/icons";
import DatePicker, { DateObject } from "react-multi-date-picker";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import i18n from "../i18n";
import {
  calendar_en,
  calendar_pl,
} from "../components/Calendar/calendarTranslations";

interface HandleFiltersChangeProps {
  filterName: string;
  filterNewValue: number | string | string[] | CareStatus[];
}

const CareList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cares, setCares] = useState<Care[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CareSearchFilters>({
    animalTypes: [],
    caretakerStatuses: [],
    clientStatuses: [],
    minCreatedTime: "",
    maxCreatedTime: "",
    minCareStart: "",
    maxCareStart: "",
    minCareEnd: "",
    maxCareEnd: "",
    minDailyPrice: undefined,
    maxDailyPrice: undefined,
    emails: [],
  });

  const onEmailsChanged = (value: string) => {
    if (filters.emails.length > 0) {
      filters.emails[0] = value;
    } else {
      filters.emails.push(value);
    }
    handleChangeFilters([
      { filterName: "emails", filterNewValue: filters["emails"] },
    ]);
  };

  const onEmailsBlur = () => {
    if (filters.emails.length > 0) {
      if (filters.emails[0] === "") {
        handleDeselectFilter(["emails"]);
      }
    }
  };

  const onDailyPriceChanged = (value: string, filterName: string) => {
    const regex = /^\d{0,5}(\.\d{0,2})?$/;
    console.log(`regex: ${regex.test(value)}`);
    if (value === "." || regex.test(value)) {
      handleChangeFilters([
        { filterName: filterName, filterNewValue: value ?? 0 },
      ]);
    }
  };

  const onDailyPriceBlur = (value: string, filterName: string) => {
    if (value.charAt(value.length - 1) === "." || value === "-") {
      value = value.slice(0, -1);
    }
    if (value.length > 1 && value.charAt(0) === "0") {
      value = value.slice(1);
    }
    handleChangeFilters([
      {
        filterName: filterName,
        filterNewValue: value !== "" ? parseFloat(value) : 0,
      },
    ]);
  };

  const careStatuses: CareStatus[] = [
    "PENDING",
    "ACCEPTED",
    "CANCELLED",
    "READY_TO_PROCEED",
    "OUTDATED",
    "CONFIRMED",
  ];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [hasFilterChanged, setHasFilterChanged] = useState<boolean>(false);

  const [wasFilterSelected, setWasFilterSelected] = useState<boolean>(false);

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: "", //TODO: change
    sortDirection: "DESC", //TODO: change
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCares = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCares(pagingParams, filters);
      if (data) {
        setCares(data.content.map((care) => new Care(care)));
        setPagination({
          current: data.pageable.pageNumber + 1,
          pageSize: data.pageable.pageSize,
          total: data.totalElements,
        });
      }
    } catch (error) {
      toast.error(t("error.getCares"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wasFilterSelected === true) {
      setHasFilterChanged(true);
      console.log(JSON.stringify(filters));
    }
  }, [selectedFilters, filters]);

  const handleChangeFilters = (changedFilters: HandleFiltersChangeProps[]) => {
    setWasFilterSelected(true);
    const newFilters = {
      animalTypes: filters.animalTypes,
      caretakerStatuses: filters.caretakerStatuses,
      clientStatuses: filters.clientStatuses,
      minCreatedTime: filters.minCreatedTime,
      maxCreatedTime: filters.maxCreatedTime,
      minCareStart: filters.minCareStart,
      maxCareStart: filters.maxCareStart,
      minCareEnd: filters.minCareEnd,
      maxCareEnd: filters.maxCareEnd,
      minDailyPrice: filters.minDailyPrice,
      maxDailyPrice: filters.maxDailyPrice,
      emails: filters.emails,
    };
    changedFilters.map((newFilter) => {
      (newFilters as any)[newFilter.filterName] =
        newFilter.filterName === "animalTypes" ||
        newFilter.filterName === "emails"
          ? (newFilter.filterNewValue as string[])
          : newFilter.filterName === "caretakerStatuses" ||
            newFilter.filterName === "clientStatuses"
          ? (newFilter.filterNewValue as CareStatus[])
          : newFilter.filterName === "minDailyPrice" ||
            newFilter.filterName === "maxDailyPrice"
          ? (newFilter.filterNewValue as number)
          : (newFilter.filterNewValue as string);
    });

    setFilters(newFilters);
  };

  const handleDeselectFilter = (filterNames: string[]) => {
    setWasFilterSelected(true);
    const newFilters = {
      animalTypes: filters.animalTypes,
      caretakerStatuses: filters.caretakerStatuses,
      clientStatuses: filters.clientStatuses,
      minCreatedTime: filters.minCreatedTime,
      maxCreatedTime: filters.maxCreatedTime,
      minCareStart: filters.minCareStart,
      maxCareStart: filters.maxCareStart,
      minCareEnd: filters.minCareEnd,
      maxCareEnd: filters.maxCareEnd,
      minDailyPrice: filters.minDailyPrice,
      maxDailyPrice: filters.maxDailyPrice,
      emails: filters.emails,
    };
    filterNames.map((filterName) => {
      (newFilters as any)[filterName] =
        filterName === "animalTypes" ||
        filterName === "caretakerStatuses" ||
        filterName === "clientStatuses" ||
        filterName === "emails"
          ? []
          : filterName === "minDailyPrice" || filterName === "maxDailyPrice"
          ? undefined
          : "";
    });
    setFilters(newFilters);
  };

  useEffect(() => {
    fetchCares();
    store.selectedMenuOption = "cares";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagingParams({
      ...pagingParams,
      page: page - 1,
      size: pageSize || 10,
    });
  };

  const formatDate = (date: DateObject) => {
    const wrappedDate = new Date(date.toString());
    return `${date.format("YYYY-MM-DD")} ${
      wrappedDate.toTimeString().split(" GMT")[0]
    }.${wrappedDate.getMilliseconds().toString().padEnd(3, "0")} ${
      wrappedDate.toTimeString().split(" GMT")[1].split(" (")[0]
    }`;
  };

  const onDateChange = (
    dates: DateObject[],
    firstFilterName: string,
    secondFilterName: string
  ) => {
    if (dates.length === 1) {
      if (firstFilterName === "minCreatedTime") {
        handleChangeFilters([
          {
            filterName: firstFilterName,
            filterNewValue: formatDate(dates[0]),
          },
          {
            filterName: secondFilterName,
            filterNewValue: "",
          },
        ]);
      } else {
        handleChangeFilters([
          {
            filterName: firstFilterName,
            filterNewValue: dates[0].format("YYYY-MM-DD"),
          },
          {
            filterName: secondFilterName,
            filterNewValue: "",
          },
        ]);
      }
    } else {
      if (dates.length === 2) {
        if (firstFilterName === "minCreatedTime") {
          handleChangeFilters([
            {
              filterName: firstFilterName,
              filterNewValue: formatDate(dates[0]),
            },
            {
              filterName: secondFilterName,
              filterNewValue: formatDate(dates[1]),
            },
          ]);
        } else {
          handleChangeFilters([
            {
              filterName: firstFilterName,
              filterNewValue: dates[0].format("YYYY-MM-DD"),
            },
            {
              filterName: secondFilterName,
              filterNewValue: dates[1].format("YYYY-MM-DD"),
            },
          ]);
        }
      } else {
        handleDeselectFilter([firstFilterName, secondFilterName]);
      }
    }
  };

  return (
    <div className="cares-list-container">
      <Spin spinning={isLoading} fullscreen />
      <h1 className="cares-title">{t("care.yourCares")}</h1>
      <div className="cares-filters-section">
        <FilterOutlined
          style={{ color: "white" }}
          className="care-list-filter-icon"
        />
        <Select
          key={i18n.language}
          className="cares-filters"
          mode="multiple"
          value={selectedFilters}
          allowClear
          placeholder={t("filters")}
          onSelect={(value: string) =>
            setSelectedFilters([...selectedFilters, value])
          }
          onDeselect={(value: string) => {
            setSelectedFilters([
              ...selectedFilters.filter((val) => val !== value),
            ]);
            if (value === "CareStart") {
              handleDeselectFilter(["minCareStart", "maxCareStart"]);
            } else {
              if (value === "CareEnd") {
                handleDeselectFilter(["minCareEnd", "maxCareEnd"]);
              } else {
                if (value === "CreatedTime") {
                  handleDeselectFilter(["minCreatedTime", "maxCreatedTime"]);
                } else {
                  handleDeselectFilter([value]);
                }
              }
            }
          }}
          onClear={() => {
            setSelectedFilters([]);
            setFilters({
              animalTypes: [],
              caretakerStatuses: [],
              clientStatuses: [],
              minCreatedTime: "",
              maxCreatedTime: "",
              minCareStart: "",
              maxCareStart: "",
              minCareEnd: "",
              maxCareEnd: "",
              minDailyPrice: undefined,
              maxDailyPrice: undefined,
              emails: [],
            });
          }}
          options={Object.keys(filters)
            .filter(
              (filter) =>
                filter !== "minCreatedTime" &&
                filter !== "maxCreatedTime" &&
                filter !== "minCareStart" &&
                filter !== "maxCareStart" &&
                filter !== "minCareEnd" &&
                filter !== "maxCareEnd"
            )
            .concat(["CreatedTime", "CareStart", "CareEnd"])
            .map((filterName) => ({
              value: filterName,
              label: t(`careSearch.${filterName}`),
            }))}
        />
      </div>
      {selectedFilters.length > 0 && (
        <div className="cares-selected-filters">
          {selectedFilters.map((filterName, index) => {
            switch (true) {
              case filterName === "CareStart" ||
                filterName === "CareEnd" ||
                filterName === "CreatedTime":
                return (
                  <DatePicker
                    onChange={(dates) => {
                      if (filterName === "CareStart") {
                        onDateChange(dates, "minCareStart", "maxCareStart");
                      } else {
                        if (filterName === "CareEnd") {
                          onDateChange(dates, "minCareEnd", "maxCareEnd");
                        } else {
                          onDateChange(
                            dates,
                            "minCreatedTime",
                            "maxCreatedTime"
                          );
                        }
                      }
                    }}
                    locale={i18n.language === "pl" ? calendar_pl : calendar_en}
                    style={{ width: 185 }}
                    range
                    plugins={[
                      highlightWeekends(),
                      <DatePanel
                        header={t("selectedDates")}
                        style={{ minWidth: 150 }}
                      />,
                    ]}
                    render={(value, openCalendar) => (
                      <Tooltip
                        trigger={["focus"]}
                        title={t(`careSearch.${filterName}`)}
                      >
                        <Input
                          className="care-list-date"
                          value={value}
                          onFocus={openCalendar}
                          placeholder={t("placeholder.date")}
                          style={{ width: 185 }}
                        />
                      </Tooltip>
                    )}
                  />
                );
              case filterName === "caretakerStatuses" ||
                filterName === "clientStatuses":
                return (
                  <Select
                    key={index}
                    className="cares-filters"
                    mode="multiple"
                    allowClear
                    placeholder={t(`careSearch.${filterName}`)} //TODO: translation
                    onSelect={(value) => {
                      console.log(filterName, value);
                      filters[filterName].push(value as CareStatus);
                      handleChangeFilters([
                        {
                          filterName: filterName,
                          filterNewValue: filters[filterName],
                        },
                      ]);
                    }}
                    onDeselect={(value: string) => {
                      handleChangeFilters([
                        {
                          filterName: filterName,
                          filterNewValue: [
                            ...filters[filterName].filter(
                              (val) => val !== value
                            ),
                          ],
                        },
                      ]);
                    }}
                    onClear={() => {
                      handleChangeFilters([
                        { filterName: filterName, filterNewValue: [] },
                      ]);
                    }}
                  >
                    {careStatuses.map((filterValue, indexStatus) => (
                      <Select.Option key={indexStatus} value={filterValue}>
                        {t(`careStatus.${filterValue.toLowerCase()}`)}
                      </Select.Option>
                    ))}
                  </Select>
                );
              case filterName === "animalTypes":
                return (
                  <Select
                    key={index}
                    className="cares-filters"
                    mode="multiple"
                    allowClear
                    placeholder={t(`careSearch.${filterName}`)} //TODO: translation
                    onSelect={(value) => {
                      filters[filterName].push(value);
                      handleChangeFilters([
                        {
                          filterName: filterName,
                          filterNewValue: filters[filterName],
                        },
                      ]);
                    }}
                    onDeselect={(value: string) =>
                      handleChangeFilters([
                        {
                          filterName: filterName,
                          filterNewValue: [
                            ...filters[filterName].filter(
                              (val) => val !== value
                            ),
                          ],
                        },
                      ])
                    }
                    onClear={() =>
                      handleChangeFilters([
                        { filterName: filterName, filterNewValue: [] },
                      ])
                    }
                  >
                    {store.animal.allAnimalTypes.map(
                      (animalType, indexAnimals) => (
                        <Select.Option key={indexAnimals} value={animalType}>
                          {t(animalType.toLowerCase())}
                        </Select.Option>
                      )
                    )}
                  </Select>
                );

              case filterName === "minDailyPrice" ||
                filterName === "maxDailyPrice":
                return (
                  <Tooltip
                    trigger={["focus"]}
                    title={t(`careSearch.${filterName}`)}
                  >
                    <Input
                      key={index}
                      addonAfter={`zł ${filterName.substring(0, 3)}`}
                      className="care-list-daily-price"
                      value={filters[filterName] ?? 0}
                      onChange={(e) =>
                        onDailyPriceChanged(e.target.value, filterName)
                      }
                      onBlur={(e) =>
                        onDailyPriceBlur(e.target.value, filterName)
                      }
                    />
                  </Tooltip>
                );

              case filterName === "emails":
                return (
                  <div>
                    <Tooltip
                      trigger={["focus"]}
                      title={t(`careSearch.${filterName}`)}
                    >
                      <Input
                        key={index}
                        allowClear
                        placeholder={t(`careSearch.${filterName}`)}
                        onBlur={() => onEmailsBlur()}
                        className="care-list-emails"
                        value={filters[filterName]}
                        onChange={(e) => onEmailsChanged(e.target.value)}
                      />
                    </Tooltip>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      )}
      <div className="care-list-filter-button-container">
        <div className="care-list-sort-container">
          <div className="care-list-sort">{t("careSearch.sort")}</div>
          <Select
            className="cares-filters"
            allowClear
            placeholder={t(`careSearch.sort`)}
            onSelect={(value) => {
              setPagingParams({
                page: pagingParams.page,
                size: pagingParams.size,
                sortBy: value,
                sortDirection: pagingParams.sortDirection,
              });
            }}
            onClear={() =>
              setPagingParams({
                page: pagingParams.page,
                size: pagingParams.size,
                sortBy: "",
                sortDirection: pagingParams.sortDirection,
              })
            }
          >
            {[
              "id",
              "submittedAt",
              "caretakerStatus",
              "clientStatus",
              "careStart",
              "careEnd",
              "description",
              "dailyPrice",
              "animal_animalType",
              "selectedOptions",
              "caretaker_email",
              "client_email",
            ].map((sortName, indexAnimals) => (
              <Select.Option key={indexAnimals} value={sortName}>
                {t(`careSearch.${sortName}`)}
              </Select.Option>
            ))}
          </Select>

          {pagingParams.sortBy !== "" && (
            <Select
              className="cares-filters"
              allowClear
              defaultValue={"DESC"}
              placeholder={t(`careSearch.sort`)}
              onSelect={(value) => {
                setPagingParams({
                  page: pagingParams.page,
                  size: pagingParams.size,
                  sortBy: pagingParams.sortBy,
                  sortDirection: value,
                });
              }}
              onClear={() =>
                setPagingParams({
                  page: pagingParams.page,
                  size: pagingParams.size,
                  sortBy: pagingParams.sortBy,
                  sortDirection: "",
                })
              }
            >
              {["ASC", "DESC"].map((sortName, indexAnimals) => (
                <Select.Option key={indexAnimals} value={sortName}>
                  {t(`careSearch.${sortName}`)}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
        <Button
          disabled={hasFilterChanged !== true}
          type="primary"
          className="care-list-filter-button"
          onClick={() => {
            setHasFilterChanged(false);
            fetchCares();
          }}
        >
          {t("careSearch.filter")}
        </Button>
      </div>
      {cares.length > 0 ? (
        <List
          className="cares-list"
          dataSource={cares}
          itemLayout="vertical"
          locale={{ emptyText: t("care.noCares") }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
          renderItem={(care) => (
            <Badge.Ribbon
              text={care.currentStatusText}
              color={care.careStatusColor}
            >
              <List.Item
                key={care.id}
                className="item"
                actions={[
                  <Button
                    className="view-details-button"
                    type="primary"
                    onClick={() => navigate(`/care/${care.id}`)}
                  >
                    {t("viewDetails")}
                  </Button>,
                ]}
                extra={
                  <img
                    className="animal-image"
                    src={`/images/${care.animalType.toLowerCase()}-card.jpg`}
                  />
                }
              >
                <List.Item.Meta
                  title={
                    <div className="pretty-wrapper">
                      {t("care.fromTo", {
                        from: care.careStart,
                        to: care.careEnd,
                        days: care.numberOfDays,
                      })}
                    </div>
                  }
                  description={
                    <Descriptions
                      bordered
                      column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                      size="small"
                    >
                      <Descriptions.Item label={t("animalType")}>
                        {t(care.animalType.toLowerCase())}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("totalPrice")}>
                        {care.totalPrice}
                      </Descriptions.Item>
                      <Descriptions.Item label={t("caretaker")}>
                        <UserInfoPill user={care.caretaker} isLink={true} />
                      </Descriptions.Item>
                      <Descriptions.Item label={t("client")}>
                        <UserInfoPill user={care.client} isLink={false} />
                      </Descriptions.Item>
                      <Descriptions.Item label={t("care.currentStatus")}>
                        {care.currentStatusText}
                      </Descriptions.Item>
                    </Descriptions>
                  }
                />
              </List.Item>
            </Badge.Ribbon>
          )}
        />
      ) : (
        <h2 className="no-cares">{t("care.noCares")}</h2>
      )}
    </div>
  );
};

export default CareList;
