import { Amenities, AnimalAttributes } from "./animal.types";

export type OfferConfigurationDTO = {
  description: string;
  dailyPrice: number;
  selectedOptions: Record<string, string[]>;
}

export type OfferConfigurationWithId = OfferConfigurationDTO & {
  id: number;
}

export type OfferConfigurationWithOptionalId = OfferConfigurationDTO & {
  id: number | null;
}

export type Availability = {
  availableFrom: string;
  availableTo: string;
}

export type Availabilities = Availability[];

export type SetAvailabilityDTO = {
  offerIds: number[];
  availabilityRanges: Availabilities;
}

export type OfferDTO = {
  description: string;
  animal: {
    animalType: string;
  };
  offerConfigurations: OfferConfigurationDTO[];
  animalAmenities: Amenities;
}

export type EditOfferDescription = Pick<OfferDTO, "animal" | "description">;

export type OfferDTOWithId = Omit<OfferDTO, "offerConfigurations"> & {
  id: number;
  offerConfigurations: OfferConfigurationWithId[];
  animalAmenities: Amenities;
  availabilities: Availabilities;
}

export type OfferConfiguration = {
  attributes: {
    [key: string]: {
      animalAttributes: AnimalAttributes;
    };
  };
  minPrice?: number;
  maxPrice?: number;
  amenities?: Amenities;
};