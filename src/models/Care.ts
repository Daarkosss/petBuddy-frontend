import { AccountDataDTO, AnimalAttributes } from "../types";
import { CareDTO, CareStatus } from "../types/care.types";
import store from "../store/RootStore";
import i18next from "i18next";
import { TimelineItemProps } from "antd";

export const calculateNumberOfDays = (dateFrom: string, dateTo: string) => {
  const diff = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // + 1 to include the end date
  return days;
}

export class Care {
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
  caretaker: AccountDataDTO;
  client: AccountDataDTO;

  constructor(data: CareDTO) {
    this.id = data.id;
    this.submittedAt = data.submittedAt;
    this.caretakerStatus = data.caretakerStatus;
    this.clientStatus = data.clientStatus;
    this.careStart = data.careStart;
    this.careEnd = data.careEnd;
    this.description = data.description;
    this.dailyPrice = data.dailyPrice;
    this.animalType = data.animalType;
    this.selectedOptions = data.selectedOptions;
    this.caretaker = data.caretaker;
    this.client = data.client;
  }

  get formattedDailyPrice(): string {
    return this.dailyPrice.toFixed(2).replace(".", ",");
  }

  get totalPrice(): string {
    return (this.dailyPrice * this.numberOfDays).toFixed(2).replace(".", ",");
  }

  get numberOfDays() {
    const days = calculateNumberOfDays(this.careStart, this.careEnd);
    return days;
  }

  get currentUserStatus() {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return this.caretakerStatus;
    } else {
      return this.clientStatus;
    }
  }

  get otherUserStatus() {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return this.clientStatus;
    } else {
      return this.caretakerStatus;
    }
  }

  get currentStatusText() {
    switch(this.currentUserStatus) {
      case "PENDING":
        return i18next.t("careStatus.waitingForYourResponse");
      case "ACCEPTED":
        if (this.otherUserStatus === "PENDING") {
          return i18next.t("careStatus.waitingForOtherResponse");
        } else {
          return i18next.t("careStatus.accepted");
        }
      case "AWAITING_PAYMENT":
        return i18next.t("careStatus.waitingToTakePlace");
      case "DONE":
        return i18next.t("careStatus.done");
      case "CANCELLED":
        return i18next.t("careStatus.cancelled");
      case "OUTDATED":
        return i18next.t("careStatus.outdated");
    }
  }

  get careStatusColor() {
    switch(this.currentUserStatus) {
      case "PENDING":
        return "orange";
      case "ACCEPTED":
        if (this.otherUserStatus === "PENDING") {
          return "orange";
        } else {
          return "green";
        }
      case "AWAITING_PAYMENT":
        return "blue";
      case "DONE":
        return "gray";
      case "CANCELLED":
        return "red";
      case "OUTDATED":
        return "gray";
    }
  }

  get formattedSubmittedAt(){
    const dateTime = new Date(this.submittedAt);
    return dateTime.toLocaleString();
  }

  get timelineItems() {
    const items: TimelineItemProps[] = [];

    // Always first item - care was reported
    items.push({
      color: "green",
      children: i18next.t("careStatus.reported"),
      label: this.formattedSubmittedAt
    });
  
    // Check if care is cancelled or outdated
    if (this.currentUserStatus === "CANCELLED") {
      items.push({
        color: "red",
        children: i18next.t("careStatus.cancelled")
      });
    }
    
    if (this.currentUserStatus === "OUTDATED") {
      items.push({
        color: "gray",
        children: i18next.t("careStatus.outdated")
      });
    }

    // Check if care is pending, so need someone's action
    if (this.currentUserStatus === "PENDING") {
      items.push({
        color: "orange",
        children: i18next.t("careStatus.waitingForYourResponse")
      });
    } else if (this.otherUserStatus === "PENDING") {
      items.push({
        color: "orange",
        children: i18next.t("careStatus.waitingForOtherResponse")
      });
    }

    // Temporary status (will be removed), check if care has awaiting payment
    if (this.currentUserStatus === "AWAITING_PAYMENT") {
      items.push({
        color: "green",
        children: i18next.t("careStatus.accepted")
      });
      items.push({
        color: "blue",
        children: i18next.t("careStatus.waitingToTakePlace")
      });
    }

    // Check if care is done
    if (this.currentUserStatus === "DONE") {
      items.push({
        color: "green",
        children: i18next.t("careStatus.done")
      });
    } 

    // If both accepted, check if care is taking place
    if (this.currentUserStatus === "ACCEPTED" && this.otherUserStatus === "ACCEPTED") {
      if (this.careStart > new Date().toISOString()) {
        items.push({
          color: "blue",
          children:i18next.t("careStatus.waitingToTakePlace")
        });
      } else if (this.careEnd < new Date().toISOString()) {
        items.push({
          color: "blue",
          children: i18next.t("careStatus.isTakingPlace")
        });
      }
    }
  
    return items;
  }
}
