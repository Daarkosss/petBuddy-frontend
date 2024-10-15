export type OfferConfigurationDTO = {
  description: string;
  dailyPrice: number;
  selectedOptions: Record<string, string[]>;
}

export type OfferConfigurationWithId = OfferConfigurationDTO & {
  id: number;
}

export type AvailabilityDTO = {
  availableFrom: string;
  availableTo: string;
}

export type SetAvailabilityDTO = {
  offerIds: number[];
  availabilityRanges: AvailabilityDTO[];
}

export type OfferDTO = {
  description: string;
  animal: {
    animalType: string;
  };
  offerConfigurations: OfferConfigurationDTO[];
  animalAmenities: string[];
}

export type EditOfferDescription = Pick<OfferDTO, "animal" | "description">;

export type OfferDTOWithId = Omit<OfferDTO, "offerConfigurations"> & {
  id: number;
  offerConfigurations: OfferConfigurationWithId[];
  animalAmenities: string[];
  availabilities: AvailabilityDTO[];
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