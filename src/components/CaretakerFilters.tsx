import { Input, Select, Button } from 'antd';
import { CaretakerSearchFilters, OfferConfiguration, AnimalSize, AnimalSex } from '../types';
import { useTranslation } from 'react-i18next';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePriceInput = (animalType: string, priceType: 'minPrice' | 'maxPrice', value: string) => {
    const regex = /^\d{0,5}?$/;
    const parsedValue = parseFloat(value) || undefined;
    
    if (regex.test(value) && (parsedValue === undefined || parsedValue >= 0)) {
      const updatedConfig = { [priceType]: parsedValue || undefined };
      onAnimalFiltersChange(animalType, updatedConfig);    
    } else {
      value = value.slice(0, -1);
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

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const renderAnimalFilters = () =>
    filters.animals?.map(({ animalType }) => (
      <div key={animalType} className="animal-filter">
        <h3>{t(animalType.toLowerCase())}</h3>
        <div className="prices">
          <div>{t('price')}</div>
          <Input
            type="number"
            placeholder={t('from')}
            value={animalFilters[animalType]?.minPrice}
            onKeyDown={handleKeyDown}
            onChange={(e) => handlePriceInput(animalType, 'minPrice', e.target.value)}
            className="input-field"
          />
          <Input
            type="number"
            placeholder={t('to')}
            value={animalFilters[animalType]?.maxPrice}
            onKeyDown={handleKeyDown}
            onChange={(e) => handlePriceInput(animalType, 'maxPrice', e.target.value)}
            className="input-field"
          />
          <div>zł</div>
        </div>
        <Select
          mode="multiple"
          placeholder={t('size')}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { attributes: { SIZE: value as AnimalSize[] } })
          }
          value={animalFilters[animalType]?.attributes?.SIZE || []}
        >
          {renderSelectOptions({ SMALL: t('small'), MEDIUM: t('medium'), BIG: t('big') })}
        </Select>
        <Select
          mode="multiple"
          placeholder={t('sex')}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { attributes: { SEX: value as AnimalSex[] } })
          }
          value={animalFilters[animalType]?.attributes?.SEX || []}
        >
          {renderSelectOptions({ MALE: t('male'), SHE: t('she') })}
        </Select>
        <Select
          mode="multiple"
          placeholder={t('amenities')}
          onChange={(value) =>
            onAnimalFiltersChange(animalType, { amenities: value as string[] })
          }
          value={animalFilters[animalType]?.amenities || []}
        >
          {renderSelectOptions({
            toys: t('amenityTypes.toys'),
            'scratching post': t('amenityTypes.scratchingPost'),
            cage: t('amenityTypes.cage'),
          })}
        </Select>
      </div>
    ));

  return (
    <div className="caretaker-sidebar">
      <h2>{t('filters')}</h2>
      <div className="filters">
        <Input
          placeholder={t('caretakerSearch.personalData')}
          value={filters.personalDataLike}
          onChange={(e) => onFiltersChange({ ...filters, personalDataLike: e.target.value })}
          className="input-field"
          onKeyDown={handleKeyDown}
        />
        <Input
          placeholder={t('city')}
          value={filters.cityLike}
          onChange={(e) => onFiltersChange({ ...filters, cityLike: e.target.value })}
          className="input-field"
          onKeyDown={handleKeyDown}
        />
        <Select
          placeholder={t('voivodeship')}
          className="input-field"
          onChange={(value) => onFiltersChange({ ...filters, voivodeship: value })}
          allowClear
          value={filters.voivodeship}
          onKeyDown={handleKeyDown}
        >
          {renderSelectOptions({
            DOLNOSLASKIE: 'Dolnośląskie',
            KUJAWSKO_POMORSKIE: 'Kujawsko-Pomorskie',
            LUBELSKIE: 'Lubelskie',
            LUBUSKIE: 'Lubuskie',
            LODZKIE: 'Łódzkie',
            MALOPOLSKIE: 'Małopolskie',
            MAZOWIECKIE: 'Mazowieckie',
            OPOLSKIE: 'Opolskie',
            PODKARPACKIE: 'Podkarpackie',
            PODLASKIE: 'Podlaskie',
            POMORSKIE: 'Pomorskie',
            SLASKIE: 'Śląskie',
            SWIETOKRZYSKIE: 'Świętokrzyskie',
            WARMINSKO_MAZURSKIE: 'Warmińsko-Mazurskie',
            WIELKOPOLSKIE: 'Wielkopolskie',
            ZACHODNIOPOMORSKIE: 'Zachodniopomorskie',
          })}
        </Select>
        <Select
          mode="multiple"
          placeholder={t('caretakerSearch.animalTypes')}
          onChange={onAnimalTypesChange}
          value={filters.animals?.map((animal) => animal.animalType)}
        >
          {renderSelectOptions({
            DOG: t('dog'),
            CAT: t('cat'),
            BIRD: t('bird'),
            REPTILE: t('reptile'),
            HORSE: t('horse'),
          })}
        </Select>
        {renderAnimalFilters()}
        <Button type="primary" onClick={handleSearch} className="button-search">
          {t('search')}
        </Button>
      </div>
    </div>
  );
};

export default CaretakerFilters;
