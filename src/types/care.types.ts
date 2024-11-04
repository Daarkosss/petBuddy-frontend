export type CareReservationDTO = {
  careStart: string,
  careEnd: string,
  description: string,
  dailyPrice: number,
  animalType: string,
  animalAttributes: AnimalAttributes
}

export type CareReservation = {
  dateRange: string[],
  description: string,
  dailyPrice: number,
  animalType: string,
  animalAttributes: AnimalAttributes
}

type AnimalAttributes = {
  [key: string]: string[];
};