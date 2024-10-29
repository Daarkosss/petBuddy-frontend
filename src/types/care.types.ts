export type CareReservation = {
  careStart: string,
  careEnd: string,
  description: string,
  dailyPrice: number,
  animalType: string,
  animalAttributes: AnimalAttributes
}

type AnimalAttributes = {
  [key: string]: string[];
};