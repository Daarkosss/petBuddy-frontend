// CaretakerFilters.tsx
import React from 'react';
import { Input, Select, Button } from 'antd';
import { CaretakerSearchFilters, OfferConfiguration, AnimalSize, AnimalSex } from '../types';
import { useTranslation } from 'react-i18next';

interface CaretakerFiltersProps {
  filters: CaretakerSearchFilters;
  animalFilters: Record<string, OfferConfiguration[]>;
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
      onSearch();
    }
  };

  const renderAnimalFilters = () => {
    return filters.animals?.map((animal) => (
      <div key={animal.animalType} className="animal-filter">
        <h3>{t(animal.animalType)}</h3>
        <div className='prices'>
          <div>{t('price')}</div>
          <Input
            type="number"
            placeholder={t('from')}
            value={animalFilters[animal.animalType]?.[0]?.minPrice}
            onChange={(e) =>
              onAnimalFiltersChange(animal.animalType, { minPrice: parseFloat(e.target.value) || undefined })
            }
            className="input-field"
          />
          <Input
            type="number"
            placeholder={t('to')}
            value={animalFilters[animal.animalType]?.[0]?.maxPrice}
            onChange={(e) =>
              onAnimalFiltersChange(animal.animalType, { maxPrice: parseFloat(e.target.value) || undefined })
            }
            className="input-field"
          />
          <div>zł</div>
        </div>
        <Select
          mode="multiple"
          placeholder={t('size')}
          onChange={(value) =>
            onAnimalFiltersChange(animal.animalType, { attributes: { SIZE: value as AnimalSize[] } })
          }
          value={animalFilters[animal.animalType]?.[0]?.attributes?.SIZE || []}
        >
          <Select value="SMALL">{t('small')}</Select>
          <Select value="MEDIUM">{t('medium')}</Select>
          <Select value="BIG">{t('big')}</Select>
        </Select>
        <Select
          mode="multiple"
          placeholder={t('sex')}
          onChange={(value) =>
            onAnimalFiltersChange(animal.animalType, { attributes: { SEX: value as AnimalSex[] } })
          }
          value={animalFilters[animal.animalType]?.[0]?.attributes?.SEX || []}
        >
          <Select value="MALE">{t('male')}</Select>
          <Select value="SHE">{t('she')}</Select>
        </Select>
      </div>
    ));
  };

  return (
    <div className="caretaker-sidebar">
      <h2>{t('filters')}</h2>
      <div className='filters'>
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
          <Select value="DOLNOSLASKIE">Dolnośląskie</Select>
          <Select value="KUJAWSKO_POMORSKIE">Kujawsko-Pomorskie</Select>
          <Select value="LUBELSKIE">Lubelskie</Select>
          <Select value="LUBUSKIE">Lubuskie</Select>
          <Select value="LODZKIE">Łódzkie</Select>
          <Select value="MALOPOLSKIE">Małopolskie</Select>
          <Select value="MAZOWIECKIE">Mazowieckie</Select>
          <Select value="OPOLSKIE">Opolskie</Select>
          <Select value="PODKARPACKIE">Podkarpackie</Select>
          <Select value="PODLASKIE">Podlaskie</Select>
          <Select value="POMORSKIE">Pomorskie</Select>
          <Select value="SLASKIE">Śląskie</Select>
          <Select value="SWIETOKRZYSKIE">Świętokrzyskie</Select>
          <Select value="WARMINSKO_MAZURSKIE">Warmińsko-Mazurskie</Select>
          <Select value="WIELKOPOLSKIE">Wielkopolskie</Select>
          <Select value="ZACHODNIOPOMORSKIE">Zachodniopomorskie</Select>        
        </Select>
        <Select
          mode="multiple"
          placeholder={t('caretakerSearch.animalTypes')}
          onChange={onAnimalTypesChange}
          value={filters.animals?.map((animal) => animal.animalType)}
        >
          <Select value="DOG">{t('dog')}</Select>
          <Select value="CAT">{t('cat')}</Select>
          <Select value="BIRD">{t('bird')}</Select>
        </Select>
        {renderAnimalFilters()}
        <Button type="primary" onClick={onSearch} className="button-search">
          {t('search')}
        </Button>
      </div>
    </div>
  );
};

export default CaretakerFilters;
