export type Amenities = string[];

export type AnimalAttributes = {
  [key: string]: string[];
};

export type AnimalConfigurationDTO = {
  animalType: string;
  animalAttributes: AnimalAttributes;
  amenities: Amenities;
}

export type AnimalConfigurationsDTO = AnimalConfigurationDTO[];

export type AnimalConfigurations = {
  [key: string]: {
    animalAttributes: AnimalAttributes;
    amenities: Amenities;
  };
};