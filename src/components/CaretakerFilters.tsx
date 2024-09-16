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
        <h3>{t(animal.animalType.toLowerCase())}</h3>
        <div className='prices'>
          <div>{t('price')}</div>
            <Input
              type="number"
              placeholder={t('from')}
              value={animalFilters[animal.animalType]?.[0]?.minPrice}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                const value = input.value;
                const regex = /^\d{0,5}?$/;

                if (regex.test(value)) {
                  const minPrice = parseFloat(value) || undefined;
                  if (minPrice === undefined || minPrice >= 0.01) {
                    onAnimalFiltersChange(animal.animalType, { minPrice });
                  }
                } else {
                  input.value = value.slice(0, -1);
                }
              }}
              className="input-field"
            />
            <Input
              type="number"
              placeholder={t('to')}
              value={animalFilters[animal.animalType]?.[0]?.maxPrice}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                const value = input.value;
                const regex = /^\d{0,5}?$/;
          
                if (regex.test(value)) {
                  const maxPrice = parseFloat(value) || undefined;
                  if (maxPrice === undefined || maxPrice < 100000) {
                    onAnimalFiltersChange(animal.animalType, { maxPrice });
                  }
                } else {
                  input.value = value.slice(0, -1);
                }
              }}
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
          <Select.Option value="SMALL">{t('small')}</Select.Option>
          <Select.Option value="MEDIUM">{t('medium')}</Select.Option>
          <Select.Option value="BIG">{t('big')}</Select.Option>
        </Select>
        <Select
          mode="multiple"
          placeholder={t('sex')}
          onChange={(value) =>
            onAnimalFiltersChange(animal.animalType, { attributes: { SEX: value as AnimalSex[] } })
          }
          value={animalFilters[animal.animalType]?.[0]?.attributes?.SEX || []}
        >
          <Select.Option value="MALE">{t('male')}</Select.Option>
          <Select.Option value="SHE">{t('she')}</Select.Option>
        </Select>
        <Select
          mode="multiple"
          placeholder={t('amenities')}
          onChange={(value) =>
            onAnimalFiltersChange(animal.animalType, { amenities: value as string[] })
          }
          value={animalFilters[animal.animalType]?.[0]?.amenities || []}
        >
          <Select.Option value="toys">{t('toys')}</Select.Option>
          <Select.Option value="scratching post">{t('scratchingPost')}</Select.Option>
          <Select.Option value="cage">{t('cage')}</Select.Option>
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
          <Select.Option value="DOLNOSLASKIE">Dolnośląskie</Select.Option>
          <Select.Option value="KUJAWSKO_POMORSKIE">Kujawsko-Pomorskie</Select.Option>
          <Select.Option value="LUBELSKIE">Lubelskie</Select.Option>
          <Select.Option value="LUBUSKIE">Lubuskie</Select.Option>
          <Select.Option value="LODZKIE">Łódzkie</Select.Option>
          <Select.Option value="MALOPOLSKIE">Małopolskie</Select.Option>
          <Select.Option value="MAZOWIECKIE">Mazowieckie</Select.Option>
          <Select.Option value="OPOLSKIE">Opolskie</Select.Option>
          <Select.Option value="PODKARPACKIE">Podkarpackie</Select.Option>
          <Select.Option value="PODLASKIE">Podlaskie</Select.Option>
          <Select.Option value="POMORSKIE">Pomorskie</Select.Option>
          <Select.Option value="SLASKIE">Śląskie</Select.Option>
          <Select.Option value="SWIETOKRZYSKIE">Świętokrzyskie</Select.Option>
          <Select.Option value="WARMINSKO_MAZURSKIE">Warmińsko-Mazurskie</Select.Option>
          <Select.Option value="WIELKOPOLSKIE">Wielkopolskie</Select.Option>
          <Select.Option value="ZACHODNIOPOMORSKIE">Zachodniopomorskie</Select.Option>        
        </Select>
        <Select
          mode="multiple"
          placeholder={t('caretakerSearch.animalTypes')}
          onChange={onAnimalTypesChange}
          value={filters.animals?.map((animal) => animal.animalType)}
        >
          <Select.Option value="DOG">{t('dog')}</Select.Option>
          <Select.Option value="CAT">{t('cat')}</Select.Option>
          <Select.Option value="BIRD">{t('bird')}</Select.Option>
          <Select.Option value="REPTILE">{t('reptile')}</Select.Option>
          <Select.Option value="HORSE">{t('horse')}</Select.Option>
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
