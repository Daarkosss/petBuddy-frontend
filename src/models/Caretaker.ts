import { CaretakerDTO, OfferDTO } from "../types";
import Voivodeship from "./Voivodeship";

class Caretaker {
  accountData: {
    email: string;
    name: string;
    surname: string;
  };
  phoneNumber: string;
  description: string;
  address: {
    city: string;
    zipCode: string;
    voivodeship: Voivodeship;
    street: string;
    streetNumber: string;
    apartmentNumber: string;
  };
  animals: string[];
  offers: OfferDTO[];
  numberOfRatings: number;
  avgRating: number | null;

  constructor(data: CaretakerDTO) {
    this.accountData = data.accountData;
    this.phoneNumber = data.phoneNumber;
    this.description = data.description;
    this.address = {
      ...data.address,
      voivodeship: new Voivodeship(data.address.voivodeship),
    };
    this.animals = data.animals;
    this.offers = data.offers;
    this.numberOfRatings = data.numberOfRatings;
    this.avgRating = data.avgRating;
  }
}
  
export default Caretaker;
  