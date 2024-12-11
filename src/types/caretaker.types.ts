import { PageableDTO, SortDTO } from "./pagination.types";
import { AccountDataDTO, Photo } from "./user.types";
import {
  AvailabilityValues,
  OfferConfiguration,
  OfferDTOWithId,
  OfferWithId,
} from "./offer.types";

export type CaretakerRatingDTO = {
  client: {
    accountData: AccountDataDTO;
  };
  caretakerEmail: string;
  rating: number;
  comment: string;
};

export type CaretakerRatingsResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: CaretakerRatingDTO[];
  number: number;
  sort: SortDTO[];
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: SortDTO[];
    unpaged: true;
    paged: true;
    pageSize: number;
    pageNumber: number;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type CaretakerBasicsDTO = {
  accountData: AccountDataDTO;
  address: AddressDTO;
  animals: string[];
  numberOfRatings: number;
  avgRating: number | null;
};

export type CaretakerDetailsDTO = CaretakerBasicsDTO & {
  phoneNumber: string;
  description: string;
  offers: OfferDTOWithId[];
  offerPhotos: Photo[];
  blocked: boolean | null;
  followed: boolean | null;
};

export type CaretakerDetails = Omit<CaretakerDetailsDTO, "offers"> & {
  offers: OfferWithId[];
};

export type AddressDTO = {
  city: string;
  zipCode: string;
  voivodeship: VoivodeshipDTO;
  street: string;
  streetNumber: string;
  apartmentNumber: string;
  latitude: number;
  longitude: number;
};

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
  caretakers: {
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
  };
  cityLatitude: number;
  cityLongitude: number;
};

export type CaretakerSearchFilters = {
  personalDataLike?: string;
  cityLike?: string;
  voivodeship?: string;
  animals?: AnimalFilter[];
  availabilities?: AvailabilityValues;
};

export type AnimalFilter = {
  animalType: string;
  offerConfiguration?: OfferConfiguration;
  availabilities?: AvailabilityValues;
};

export type CaretakerFormFields = {
  phoneNumber: string;
  description: string;
  address: AddressDTO;
};

export type Rating = {
  rating: number;
  comment: string;
};
