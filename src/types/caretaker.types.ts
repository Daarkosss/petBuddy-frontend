import { PageableDTO, SortDTO } from './pagination.types';

export type CaretakerDTO = {
  accountData: {
    email: string;
    name: string;
    surname: string;
  };
  phoneNumber: string;
  description: string;
  address: AddressDTO;
  animals: string[];
  offers: OfferDTO[];
  numberOfRatings: number;
  avgRating: number | null;
}

export type AddressDTO = {
  city: string;
  zipCode: string;
  voivodeship: Voivodeship;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
}

export type Voivodeship =
  | 'DOLNOSLASKIE'
  | 'KUJAWSKO_POMORSKIE'
  | 'LUBELSKIE'
  | 'LUBUSKIE'
  | 'LODZKIE'
  | 'MALOPOLSKIE'
  | 'MAZOWIECKIE'
  | 'OPOLSKIE'
  | 'PODKARPACKIE'
  | 'PODLASKIE'
  | 'POMORSKIE'
  | 'SLASKIE'
  | 'SWIETOKRZYSKIE'
  | 'WARMINSKO_MAZURSKIE'
  | 'WIELKOPOLSKIE'
  | 'ZACHODNIOPOMORSKIE';

export type OfferDTO = {
  id: number;
  description: string;
  animal: {
    animalType: string;
  };
  offerConfigurations: OfferConfigurationDTO[];
  animalAmenities: string[];
}

export type OfferConfigurationDTO = {
  id: number;
  description: string;
  dailyPrice: number;
  selectedOptions: Record<string, string[]>;
}

export type CaretakerResponse = {
  content: CaretakerDTO[];
  pageable: PageableDTO;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: SortDTO[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}