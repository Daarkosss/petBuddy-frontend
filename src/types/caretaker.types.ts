import { PageableDTO, SortDTO } from "./pagination.types";
import { AccountDataDTO } from "./user.types";
import { OfferConfiguration, OfferDTOWithId } from "./offer.types";

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
  offers: OfferDTOWithId[];
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

export type AnimalFilter = {
  animalType: string;
  offerConfigurations: OfferConfiguration[];
};

export type CaretakerFormFields = {
  phoneNumber: string;
  description: string;
  address: AddressDTO;
}