import { Input, Select, Button } from "antd";
import { CaretakerSearchFilters, OfferConfiguration } from "../types";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { KeyboardEvent } from "react";
import store from "../store/RootStore";
import MultiCalendar from "./Calendar/MultiCalendar";

interface CaretakerFiltersProps {
  filters: CaretakerSearchFilters;
  animalFilters: Record<string, OfferConfiguration>;
  onFiltersChange: (filters: CaretakerSearchFilters) => void;
  onAnimalFiltersChange: (animalType: string, updatedConfig: Partial<OfferConfiguration>) => void;
  onAnimalTypesChange: (selectedAnimalTypes: string[]) => void;
  onSortChange: (sortBy: string, sortDirection: string) => void;
  onSearch: () => void;
}

const CaretakerFilters: React.FC<CaretakerFiltersProps> = ({
  filters,
  animalFilters,
  onFiltersChange,
  onAnimalFiltersChange,
  onAnimalTypesChange,
  onSortChange,
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

  const handleSortChange = (sorter: string) => {
    switch (sorter) {
      case "default":
        onSortChange("ratingScore", "DESC");
        break;
      case "avgRatingDesc":
        onSortChange("avgRating", "DESC");
        break;
      case "avgRatingAsc":
        onSortChange("avgRating", "ASC");
        break;
      case "numberOfRatingsDesc":
        onSortChange("numberOfRatings", "DESC");
        break;
      case "numberOfRatingsAsc":
        onSortChange("numberOfRatings", "ASC");
        break;
    }
  };

  const renderAvailableSorters = () => [
    { value : "default", label: t("sort.default") },
    { value: "avgRatingDesc", label: t("sort.avgRatingDesc") },
    { value: "avgRatingAsc", label: t("sort.avgRatingAsc") },
    { value: "numberOfRatingsDesc", label: t("sort.numberOfRatingsDesc") },
    { value: "numberOfRatingsAsc", label: t("sort.numberOfRatingsAsc") },
  ];

  const renderAnimalFilters = () =>
    filters.animals?.map(({ animalType }) => (
      <div key={animalType} className="animal-filter">
        <h3>{t(`animalTypes.${animalType}`)}</h3>
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
        {store.animal.getAnimalAttributeKeys(animalType).map((attributeKey) => (
          <Select
            key={animalType + attributeKey}
            mode="multiple"
            showSearch={false}
            placeholder={t(`${attributeKey}.title`)}
            onChange={(value) =>
              onAnimalFiltersChange(animalType, { attributes: { [attributeKey]: value } })
            }
            value={animalFilters[animalType]?.attributes?.[attributeKey] || []}
            notFoundContent={t("noData")}
            options={store.animal.getAttributeValues(animalType, attributeKey).map((value) => ({
              value,
              label: t(`${attributeKey}.${value}`)
            }))}
          />
        ))}
        <Select
          mode="multiple"
          showSearch={false}
          placeholder={t("amenities")}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { amenities: value as string[] })
          }
          value={animalFilters[animalType]?.amenities || []}
          notFoundContent={t("noData")}
          options={store.animal.getAmenities(animalType).map((amenity) => ({
            value: amenity,
            label: t(`amenityTypes.${amenity}`)
          }))}
        />
      </div>
    ));

  return (
    <div className="caretaker-sidebar">
      <h2>{t("sort.title")}</h2>
      <Select
        style={{ width: "100%" }}
        showSearch={false}
        defaultValue="default"
        options={renderAvailableSorters()}
        onChange={handleSortChange}
      />
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
          showSearch={false}
          placeholder={t("animalTypes.title")}
          onChange={onAnimalTypesChange}
          value={filters.animals?.map((animal) => animal.animalType)}
          options={store.animal.allAnimalTypes.map((animalType) => ({
            value: animalType,
            label: t(`animalTypes.${animalType}`)
          }))}
        />
        {filters.animals && filters.animals.length > 0 && 
          <div className="calendar-wrapper">
            <h3>{t("availability")}</h3>
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
