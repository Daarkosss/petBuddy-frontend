import { AccountDataDTO, CaretakerBasicsDTO, CaretakerDetailsDTO, OfferDTO } from "../types";
import Voivodeship from "./Voivodeship";

export class CaretakerBasics {
  accountData: AccountDataDTO;
  address: {
    city: string;
    zipCode: string;
    voivodeship: Voivodeship;
    street: string;
    streetNumber: string;
    apartmentNumber: string;
  };
  animals: string[];
  numberOfRatings: number;
  avgRating: number | null;

  constructor(data: CaretakerBasicsDTO) {
    this.accountData = data.accountData;
    this.address = {
      ...data.address,
      voivodeship: new Voivodeship(data.address.voivodeship),
    };
    this.animals = data.animals;
    this.numberOfRatings = data.numberOfRatings;
    this.avgRating = data.avgRating;
  }
}

export class CaretakerDetails extends CaretakerBasics {
  phoneNumber: string;
  description: string;
  offers: OfferDTO[];

  constructor(data: CaretakerDetailsDTO) {
    super(data);
    this.phoneNumber = data.phoneNumber;
    this.description = data.description;
    this.offers = data.offers;
  }
}  