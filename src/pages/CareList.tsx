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
  Popover,
  Modal,
} from "antd";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Care } from "../models/Care";
import UserInfoPill from "../components/UserInfoPill";
import { CareSearchFilters, CareStatus } from "../types/care.types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";
import i18n from "../i18n";
import {
  calendar_en,
  calendar_pl,
} from "../components/Calendar/calendarTranslations";
import RateCaretakerBox from "../components/RateCaretakerBox";

export interface HandleFiltersChangeProps {
  filterName: string;
  filterNewValue: number | string | string[] | CareStatus[] | undefined;
}

const CareList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cares, setCares] = useState<Care[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
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
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [careToRateIndex, setCareToRateIndex] = useState<number | null>(null);

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

  const careStatuses: CareStatus[] = [
    "PENDING",
    "ACCEPTED",
    "CANCELLED",
    "READY_TO_PROCEED",
    "OUTDATED",
    "CONFIRMED",
  ];

  const availableFilters = [
    "animalTypes",
    "caretakerStatuses",
    "clientStatuses",
    "minCreatedTime",
    "maxCreatedTime",
    "minCareStart",
    "maxCareStart",
    "minCareEnd",
    "maxCareEnd",
    "minDailyPrice",
    "maxDailyPrice",
    "emails",
    "CareStart",
    "CareEnd",
    "CreatedTime",
  ];

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 5,
    sortBy: "submittedAt",
    sortDirection: "DESC",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
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

  const formatDate = (date: DateObject, isEndDate: boolean) => {
    let time;
    if (!isEndDate) {
      time = "00:00:00.000";
    } else {
      time = "23:59:59.999";
    }
    const wrappedDate = new Date(date.toString());
    return `${date.format("YYYY-MM-DD")} ${time} ${
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
        setFilters({
          ...filters,
          [firstFilterName]: formatDate(dates[0], false),
          [secondFilterName]: "",
        });
      } else {
        setFilters({
          ...filters,
          [firstFilterName]: dates[0].format("YYYY-MM-DD"),
          [secondFilterName]: "",
        });
      }
    } else {
      if (dates.length === 2) {
        if (firstFilterName === "minCreatedTime") {
          setFilters({
            ...filters,
            [firstFilterName]: formatDate(dates[0], false),
            [secondFilterName]: formatDate(dates[1], true),
          });
        } else {
          setFilters({
            ...filters,
            [firstFilterName]: dates[0].format("YYYY-MM-DD"),
            [secondFilterName]: dates[1].format("YYYY-MM-DD"),
          });
        }
      } else {
        setFilters({
          ...filters,
          [firstFilterName]: "",
          [secondFilterName]: "",
        });
      }
    }
  };

  const onSortChange = (sortBy: string, howSort: string) => {
    setPagingParams({
      page: pagingParams.page,
      size: pagingParams.size,
      sortBy: sortBy,
      sortDirection: howSort,
    });
  };

  const renderCareFilters = () => {
    return availableFilters.map((filterName, index) => {
      switch (filterName) {
        case "CareStart":
        case "CareEnd":
        case "CreatedTime":
          return (
            <div className="calendar-wrapper" key={filterName}>
              <h3>{t(`careSearch.${filterName}`)}</h3>
              <DatePicker
                maxDate={filterName === "CreatedTime" ? new Date() : undefined}
                key={filterName}
                onChange={(dates) =>
                  onDateChange(dates, `min${filterName}`, `max${filterName}`)
                }
                value={[
                  filters[`min${filterName}`] || "",
                  filters[`max${filterName}`] || "",
                ]}
                locale={i18n.language === "pl" ? calendar_pl : calendar_en}
                range
                plugins={[highlightWeekends()]}
                render={(value, openCalendar) => (
                  <Tooltip
                    className="care-list-date"
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
        case "caretakerStatuses":
        case "clientStatuses":
          return (
            <Select
              key={`cs${index}`}
              className="cares-filters"
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
              onDeselect={(value: string) => {
                setFilters({
                  ...filters,
                  [filterName]: filters[filterName].filter(
                    (val) => val !== value
                  ),
                });
              }}
              onClear={() => {
                setFilters({
                  ...filters,
                  [filterName]: [],
                });
              }}
            >
              {careStatuses.map((filterValue, indexStatus) => (
                <Select.Option key={`cst${indexStatus}`} value={filterValue}>
                  {t(`careStatus.${filterValue.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          );
        case "animalTypes":
          return (
            <Select
              key={`at${index}`}
              className="cares-filters"
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
                className="care-list-daily-price"
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
            <div key={`emd${index}`} className="care-list-emails">
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
    <div className="care-list-main-container">
      <div className="care-list-sidebar">
        <h2>{t("sort.title")}</h2>
        <Select
          style={{ width: "100%" }}
          showSearch={false}
          value={pagingParams.sortBy}
          defaultValue="submittedAt"
          options={[
            "submittedAt",
            "caretakerStatus",
            "clientStatus",
            "careStart",
            "careEnd",
            "dailyPrice",
            "animal_animalType",
            "caretaker_email",
            "client_email",
          ].map((sortName) => ({
            value: sortName,
            label: t(`careSearch.${sortName}`),
          }))}
          onChange={(value) => onSortChange(value, pagingParams.sortDirection)}
        />
        <Select
          style={{ width: "100%" }}
          defaultValue={"DESC"}
          value={pagingParams.sortDirection}
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
            <Select.Option key={`${sortName}${indexAnimals}`} value={sortName}>
              {t(`careSearch.${sortName}`)}
            </Select.Option>
          ))}
        </Select>
        <h2>{t("filters")}</h2>
        <div className="filters">
          {renderCareFilters()}
          <Button
            type="primary"
            onClick={() => fetchCares()}
            className="search-button"
          >
            {t("search")}
          </Button>
        </div>
      </div>
      <div className="cares-list-container">
        <Modal
          title={t("care.rate")}
          open={isOfferModalOpen}
          onCancel={() => setIsOfferModalOpen(false)}
          footer={null}
          maskClosable={false}
        >
          <RateCaretakerBox
            onSubmit={() => setIsOfferModalOpen(false)}
            careId={careToRateIndex ?? undefined}
          />
        </Modal>
        <Spin spinning={isLoading} fullscreen />
        <h1 className="cares-title">{t("care.yourCares")}</h1>
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
                text={care.getCurrentStatusText(true)}
                color={care.currentStatusColor}
              >
                <List.Item
                  key={care.id}
                  className="item"
                  actions={
                    care.caretaker.email === store.user.profile?.email
                      ? [
                          <Button
                            className="view-details-button"
                            type="primary"
                            onClick={() => navigate(`/care/${care.id}`)}
                          >
                            {t("viewDetails")}
                          </Button>,
                        ]
                      : [
                          <Button
                            className="view-details-button"
                            type="primary"
                            onClick={() => navigate(`/care/${care.id}`)}
                          >
                            {t("viewDetails")}
                          </Button>,

                          care.caretakerStatus !== "CONFIRMED" ? (
                            <Popover
                              content={t("care.rateNotAllowedInfo")}
                              title={t("care.rateNotAllowed")}
                            >
                              <Button disabled>{t("care.rate")}</Button>
                            </Popover>
                          ) : (
                            <Button
                              className="view-details-button"
                              type="primary"
                              onClick={() => {
                                setCareToRateIndex(care.id);
                                setIsOfferModalOpen(true);
                              }}
                            >
                              {t("care.rate")}
                            </Button>
                          ),
                        ]
                  }
                  extra={
                    <img
                      className="animal-image"
                      src={`/images/animals/${care.animalType.toLowerCase()}.jpg`}
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
                          {t(`animalTypes.${care.animalType}`)}
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
                          {care.getCurrentStatusText()}
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
    </div>
  );
};

export default CareList;
