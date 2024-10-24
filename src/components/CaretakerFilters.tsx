import { Input, Select, Button } from "antd";
import { CaretakerSearchFilters, OfferConfiguration, AnimalSize, AnimalSex } from "../types";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { KeyboardEvent } from "react";
import MultiCalendar from "./Calendar/MultiCalendar";

interface CaretakerFiltersProps {
  filters: CaretakerSearchFilters;
  animalFilters: Record<string, OfferConfiguration>;
  onFiltersChange: (filters: CaretakerSearchFilters) => void;
  onAnimalFiltersChange: (animalType: string, updatedConfig: Partial<OfferConfiguration>) => void;
  onAnimalTypesChange: (selectedAnimalTypes: string[]) => void;
  onSearch: () => void;
}

const CaretakerFilters: React.FC<CaretakerFiltersProps> = ({
  filters,
  animalFilters,
  onFiltersChange,
  onAnimalFiltersChange,
  onAnimalTypesChange,
  onSearch,
}) => {
  const { t } = useTranslation();

  const handlePriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    const regex = /^\d/;

    const allowedKeys = ["Backspace", "Delete", ","];
    if (!regex.test(value) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePriceChange = (animalType: string, priceType: "minPrice" | "maxPrice", value: string) => {
    const regex = /^\d{0,5}(\.\d{0,2})?$/;
    const parsedValue = parseFloat(value);
    
    if (regex.test(value)) {
      const updatedConfig = { [priceType]: parsedValue || undefined };
      onAnimalFiltersChange(animalType, updatedConfig);    
    }
  };
  const checkAndSwapPrices = () => {
    Object.keys(animalFilters).forEach((animalType) => {
      const { minPrice, maxPrice } = animalFilters[animalType] || {};

      if (minPrice && maxPrice && minPrice > maxPrice) {
        onAnimalFiltersChange(animalType, { minPrice: maxPrice, maxPrice: minPrice });
      }
    });
  };

  const handleSearch = () => {
    checkAndSwapPrices();
    onSearch();
  };

  const renderAnimalFilters = () =>
    filters.animals?.map(({ animalType }) => (
      <div key={animalType} className="animal-filter">
        <h3>{t(animalType.toLowerCase())}</h3>
        <div className="prices">
          <div>{t("price")}</div>
          <Input
            type="number"
            min={0}
            placeholder={t("from")}
            value={animalFilters[animalType]?.minPrice}
            onChange={(e) => handlePriceChange(animalType, "minPrice", e.target.value)}
            onKeyDown={handlePriceKeyDown}
            onPressEnter={handleSearch}
            className="input-field"
          />
          <Input
            type="number"
            min={0}
            placeholder={t("to")}
            value={animalFilters[animalType]?.maxPrice}
            onChange={(e) => handlePriceChange(animalType, "maxPrice", e.target.value)}
            onKeyDown={handlePriceKeyDown}
            onPressEnter={handleSearch}
            className="input-field"
          />
          <div>zł</div>
        </div>
        <Select
          mode="multiple"
          placeholder={t("size")}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { attributes: { SIZE: value as AnimalSize[] } })
          }
          value={animalFilters[animalType]?.attributes?.SIZE || []}
          options={[
            { value: "SMALL", label: t("small") },
            { value: "MEDIUM", label: t("medium") },
            { value: "BIG", label: t("big") }
          ]}
        />
        <Select
          mode="multiple"
          placeholder={t("sex")}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { attributes: { SEX: value as AnimalSex[] } })
          }
          value={animalFilters[animalType]?.attributes?.SEX || []}
          options={[
            { value: "MALE", label: t("male") },
            { value: "SHE", label: t("she") }
          ]}
        />
        <Select
          mode="multiple"
          placeholder={t("amenities")}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { amenities: value as string[] })
          }
          value={animalFilters[animalType]?.amenities || []}
          options={[
            { value: "toys", label: t("amenityTypes.toys") },
            { value: "scratching post", label: t("amenityTypes.scratching post") },
            { value: "cage", label: t("amenityTypes.cage") },
          ]}
        />
      </div>
    ));

  return (
    <div className="caretaker-sidebar">
      <h2>{t("filters")}</h2>
      <div className="filters">
        <Input
          placeholder={t("caretakerSearch.personalData")}
          value={filters.personalDataLike}
          onChange={(e) => onFiltersChange({ ...filters, personalDataLike: e.target.value })}
          className="input-field"
          onPressEnter={handleSearch}
          />
        <Input
          placeholder={t("addressDetails.city")}
          value={filters.cityLike}
          onChange={(e) => onFiltersChange({ ...filters, cityLike: e.target.value })}
          className="input-field"
          onPressEnter={handleSearch}
          />
        <Select
          placeholder={t("addressDetails.voivodeship")}
          className="input-field"
          onChange={(value) => onFiltersChange({ ...filters, voivodeship: value })}
          allowClear
          value={filters.voivodeship}
          options={Voivodeship.voivodeshipOptions}
        />
        <Select
          mode="multiple"
          placeholder={t("caretakerSearch.animalTypes")}
          onChange={onAnimalTypesChange}
          value={filters.animals?.map((animal) => animal.animalType)}
          options={[
            { value: "DOG", label: t("dog") },
            { value: "CAT", label: t("cat") },
            { value: "BIRD", label: t("bird") },
            { value: "REPTILE", label: t("reptile") },
            { value: "HORSE", label: t("horse") }
          ]}
        />
        {filters.animals && filters.animals.length > 0 && 
          <div className="calendar-wrapper">
            <MultiCalendar
              dateValue={filters.availabilities}
              handleChange={(value) => onFiltersChange({ ...filters, availabilities: value })}
              datePanelPosition="bottom"
            />
          </div>
        }
        {renderAnimalFilters()}
        <Button type="primary" onClick={handleSearch} className="search-button">
          {t("search")}
        </Button>
      </div>
    </div>
  );
};

export default CaretakerFilters;
