// SearchBar.tsx
import { Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { AvailabilityValues, CaretakerSearchFilters } from "../types";
import { Dispatch, SetStateAction } from "react";
import store from "../store/RootStore";
import MultiDatePicker from "./Calendar/MultiDatePicker";

interface SearchBarProps {
  filters: CaretakerSearchFilters;
  setFilters: Dispatch<SetStateAction<CaretakerSearchFilters>>
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, setFilters, handleSearch }) => {
  const { t } = useTranslation();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, cityLike: e.target.value });
  };

  const handleVoivodeshipChange = (value: string) => {
    setFilters({ ...filters, voivodeship: value });
  };

  const handleAnimalTypeChange = (value: string) => {
    setFilters({
      ...filters,
      animals: [{ animalType: value }],
    });
  };

  const handleAvailabilitiesChange = (availabilities: AvailabilityValues) => {
    setFilters((prev) => {
      if (!prev.animals || prev.animals.length === 0) {
        return prev;
      }
      return {
        ...prev,
        availabilities: availabilities,
        animals: [{ 
          ...prev.animals[0]
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
          options={Voivodeship.voivodeshipOptions}
        />
      </Form.Item>

      <Form.Item layout="vertical" label={t("caretakerSearch.animalType")}>
        <Select
          className="search-select"
          placeholder={t("placeholder.animalType")}
          onChange={handleAnimalTypeChange}
          options={store.animal.allAnimalTypes.map((animalType) => ({
            value: animalType,
            label: t(`animalTypes.${animalType}`)
          }))}
        />
      </Form.Item>

      <Form.Item layout="vertical" label={t("date")}>
        <MultiDatePicker
          handleChange={handleAvailabilitiesChange}
          dateValue={filters.availabilities}
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
