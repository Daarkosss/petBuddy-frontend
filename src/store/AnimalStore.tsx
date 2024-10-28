import { makeAutoObservable } from "mobx";
import { AnimalConfigurations, AnimalConfigurationsDTO } from "../types/animal.types";

class AnimalStore {
  animalConfigurations: AnimalConfigurations = {};

  constructor() {
    makeAutoObservable(this);
  }

  get allAnimalCongigurations(): AnimalConfigurations {
    return this.animalConfigurations;
  }

  set allAnimalCongigurations(value: AnimalConfigurationsDTO) {
    this.animalConfigurations = value.reduce((acc, animal) => {
      acc[animal.animalType] = {
        animalAttributes: animal.animalAttributes,
        amenities: animal.amenities,
      };
      return acc;
    }, {} as AnimalConfigurations);
  }

  get allAnimalTypes(): string[] {
    return Object.keys(this.animalConfigurations);
  }

  getAnimalAttributeKeys(animalType: string): string[] {
    return Object.keys(this.animalConfigurations[animalType]?.animalAttributes || {});
  }

  getAttributeValues(animalType: string, attributeKey: string): string[] {
    return this.animalConfigurations[animalType]?.animalAttributes[attributeKey] || [];
  }

  getAmenities(animalType: string): string[] {
    return this.animalConfigurations[animalType]?.amenities || [];
  }

  reset() {
    this.animalConfigurations = {};
  }
}

export default AnimalStore;
