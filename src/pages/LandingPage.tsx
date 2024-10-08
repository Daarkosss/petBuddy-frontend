import { Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { useEffect, useState } from "react";
import store from "../store/RootStore";
import { CaretakerSearchFilters } from "../types";
import { useNavigate } from "react-router-dom";
import DatePicker, { Value } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import weekends from "react-multi-date-picker/plugins/highlight_weekends"

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<CaretakerSearchFilters>({
    personalDataLike: "",
    cityLike: "",
    voivodeship: undefined,
    animals: [],
    availabilities: [], // To store selected availability date ranges
  });

  useEffect(() => {
    store.selectedMenuOption = "home";
  }, []);

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, cityLike: e.target.value }));
  };

  const handleVoivodeshipChange = (value: string) => {
    setFilters((prev) => ({ ...prev, voivodeship: value }));
  };

  const handleAnimalTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      animals: [{ animalType: value, offerConfigurations: [] }],
    }));
  };

  const handleAvailabilitiesChange = (dates: Value[][]) => {
    // const formattedDates = dates.map(date => date.format("YYYY-MM-DD"));
    setFilters((prev) => ({
      ...prev,
      availability: dates, // Store the selected date ranges
    }));
  };

  const handleSearch = async () => {
    console.log("filters", filters);
    navigate("/caretaker/search", { state: { filters } });
  };

  return (
    <div className="landing-page">
      <div className="main-content">
        <h2>{t("landingPage.title")}</h2>
        <p>{t("landingPage.subtitle")}</p>
      </div>

      <div className="search-container">
        <h3>{t("landingPage.searchTitle")}</h3>
        <div className="search-fields">
          <Form layout="inline" className="search-form">
            <Form.Item
              layout="vertical"
              label={t("addressDetails.city")}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder={t("placeholder.city")}
                className="input-field"
                value={filters.cityLike}
                onChange={handleCityChange}
              />
            </Form.Item>
            <Form.Item layout="vertical" label={t("addressDetails.voivodeship")}>
              <Select
                placeholder={t("placeholder.voivodeship")}
                className="input-field"
                allowClear
                style={{ width: "180px" }}
                value={filters.voivodeship}
                onChange={handleVoivodeshipChange}
              >
                {renderSelectOptions(Voivodeship.voivodeshipMap)}
              </Select>
            </Form.Item>

            <Form.Item layout="vertical" label={t("caretakerSearch.animalType")}>
              <Select
                className="search-select"
                placeholder={t("placeholder.animalType")}
                onChange={handleAnimalTypeChange}
              >
                {renderSelectOptions({
                  DOG: t("dog"),
                  CAT: t("cat"),
                  BIRD: t("bird"),
                  REPTILE: t("reptile"),
                  HORSE: t("horse"),
                })}
              </Select>
            </Form.Item>

            <Form.Item layout="vertical" label={t("date")}>
              <DatePicker
                value={filters.availabilities}
                onChange={handleAvailabilitiesChange}
                placeholder={t("placeholder.date")}
                multiple
                range
                style={{ height: 30, width: 190 }}
                format='DD-MM-YYYY'
                plugins={[
                  weekends(),
                  <DatePanel sort="date" style={{ width: 150 }} />
                ]}
              />
            </Form.Item>

            <Button className="search-button" onClick={handleSearch} icon={<SearchOutlined />}>
              {t("search")}
            </Button>
          </Form>
        </div>
      </div>

      <div className="main-image">
        <img src="/caretakerImage.png" alt="Dog and Woman" />
      </div>
    </div>
  );
};

export default LandingPage;
