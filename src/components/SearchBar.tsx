// SearchBar.tsx
import { Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { CaretakerSearchFilters } from "../types";
import { Dispatch, SetStateAction } from "react";
import MultiDatePicker from "./MultiDatePicker";
import { Value } from "react-multi-date-picker";

interface SearchBarProps {
  filters: CaretakerSearchFilters;
  setFilters: Dispatch<SetStateAction<CaretakerSearchFilters>>
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, setFilters, handleSearch }) => {
  const { t } = useTranslation();

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, cityLike: e.target.value });
  };

  const handleVoivodeshipChange = (value: string) => {
    setFilters({ ...filters, voivodeship: value });
  };

  const handleAnimalTypeChange = (value: string) => {
    setFilters({
      ...filters,
      animals: [{ animalType: value, offerConfigurations: [] }],
    });
  };

  const formatDateTime = (date: string): string => { // Temporary format until backend is not corrected
    return `${date} 00:00:00.000 +0100`;
  };

  const handleAvailabilitiesChange = (availabilities: Value[][]) => {
    setFilters((prev) => {
      if (!prev.animals || prev.animals.length === 0) {
        return prev;
      }
  
      return {
        ...prev,
        animals: [{ 
          ...prev.animals[0],
          offerConfigurations: [{
            availabilities: availabilities.map((dateRange) => ({
              availableFrom: formatDateTime(dateRange[0] as string) || "",
              availableTo: formatDateTime(dateRange[1] as string) || "",
            })),
          }],
        }],
      };
    });
  };

  return (
    <Form layout="inline" className="search-form">
      <Form.Item
        layout="vertical"
        label={t("addressDetails.city")}
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
        <MultiDatePicker
          handleChange={handleAvailabilitiesChange}
          dateValue={filters.animals?.[0]?.offerConfigurations?.[0]?.availabilities.map((date) => [date.availableFrom, date.availableTo])}
          isDisabled={filters.animals?.length === 0}
        />
      </Form.Item>

      <Button className="search-button" onClick={handleSearch} icon={<SearchOutlined />}>
        {t("search")}
      </Button>
    </Form>
  );
};

export default SearchBar;
