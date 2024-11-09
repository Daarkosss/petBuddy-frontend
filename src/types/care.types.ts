import { PageableDTO, SortDTO } from "./pagination.types";

export type CareReservationDTO = {
  careStart: string,
  careEnd: string,
  description: string,
  dailyPrice: number,
  animalType: string,
  selectedOptions: AnimalAttributes
}

export type CareReservation = {
  dateRange: string[],
  description: string,
  dailyPrice: number,
  animalType: string,
  selectedOptions: AnimalAttributes
}

export type AnimalAttributes = {
  [key: string]: string[];
};

export type CareStatus = "PENDING" | "ACCEPTED" | "CANCELLED" | "AWAITING_PAYMENT" | "PAID" | "OUTDATED" | "DONE";

export type CareDTO = {
  id: number;
  submittedAt: string;
  caretakerStatus: CareStatus;
  clientStatus: CareStatus;
  careStart: string;
  careEnd: string;
  description: string;
  dailyPrice: number;
  animalType: string;
  selectedOptions: AnimalAttributes;
  caretakerEmail: string;
  clientEmail: string;
}

export type GetCaresDTO = {
  content: CareDTO[];
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