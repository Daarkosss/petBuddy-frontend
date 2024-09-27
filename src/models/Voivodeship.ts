import { VoivodeshipDTO } from "../types";

const voivodeshipMap: Record<VoivodeshipDTO, string> = {
  DOLNOSLASKIE: "dolnośląskie",
  KUJAWSKO_POMORSKIE: "kujawsko-pomorskie",
  LUBELSKIE: "lubelskie",
  LUBUSKIE: "lubuskie",
  LODZKIE: "łódzkie",
  MALOPOLSKIE: "małopolskie",
  MAZOWIECKIE: "mazowieckie",
  OPOLSKIE: "opolskie",
  PODKARPACKIE: "podkarpackie",
  PODLASKIE: "podlaskie",
  POMORSKIE: "pomorskie",
  SLASKIE: "śląskie",
  SWIETOKRZYSKIE: "świętokrzyskie",
  WARMINSKO_MAZURSKIE: "warmińsko-mazurskie",
  WIELKOPOLSKIE: "wielkopolskie",
  ZACHODNIOPOMORSKIE: "zachodniopomorskie",
};

class Voivodeship {
  private name: VoivodeshipDTO;

  constructor(name: VoivodeshipDTO) {
    this.name = name;
  }

  get originalName(): VoivodeshipDTO {
    return this.name;
  }

  toString = () : string => {
    return voivodeshipMap[this.name];
  }
}

export default Voivodeship;