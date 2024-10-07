import { PageableDTO, SortDTO } from "./pagination.types";
import { AccountDataDTO } from "./user.types";

export type CaretakerBasicsDTO = {
  accountData: AccountDataDTO;
  address: AddressDTO;
  animals: string[];
  numberOfRatings: number;
  avgRating: number | null;
}

export type CaretakerDetailsDTO = CaretakerBasicsDTO & {
  phoneNumber: string;
  description: string;
  offers: OfferDTO[];
}

export type AddressDTO = {
  city: string;
  zipCode: string;
  voivodeship: VoivodeshipDTO;
  street: string;
  streetNumber: string;
  apartmentNumber: string;
}

export type VoivodeshipDTO =
  | "DOLNOSLASKIE"
  | "KUJAWSKO_POMORSKIE"
  | "LUBELSKIE"
  | "LUBUSKIE"
  | "LODZKIE"
  | "MALOPOLSKIE"
  | "MAZOWIECKIE"
  | "OPOLSKIE"
  | "PODKARPACKIE"
  | "PODLASKIE"
  | "POMORSKIE"
  | "SLASKIE"
  | "SWIETOKRZYSKIE"
  | "WARMINSKO_MAZURSKIE"
  | "WIELKOPOLSKIE"
  | "ZACHODNIOPOMORSKIE";

export type OfferDTO = {
  id: number;
  description: string;
  animal: {
    animalType: string;
  };
  offerConfigurations: OfferConfigurationDTO[];
  animalAmenities: string[];
  availabilities: AvailabilityDTO[];
}

export type AvailabilityDTO = {
  availableFrom: string;
  availableTo: string;
}

export type OfferConfigurationDTO = {
  id: number;
  description: string;
  dailyPrice: number;
  selectedOptions: Record<string, string[]>;
}

export type CaretakerBasicsResponse = {
  content: CaretakerBasicsDTO[];
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

export type CaretakerSearchFilters = {
  personalDataLike?: string;
  cityLike?: string;
  voivodeship?: string;
  animals?: AnimalFilter[];
}

export type AnimalSex = "MALE" | "SHE";
export type AnimalSize = "SMALL" | "MEDIUM" | "BIG"; 

export type OfferConfiguration = {
  attributes?: {
    SIZE?: AnimalSize[];
    SEX?: AnimalSex[];
  };
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
};

export type AnimalFilter = {
  animalType: string;
  offerConfigurations: OfferConfiguration[];
};

export type CaretakerFormFields = {
  phoneNumber: string;
  description: string;
  address: AddressDTO;
}