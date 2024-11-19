import { AccountDataDTO, AnimalAttributes } from "../types";
import { CareDTO, CareHistoricalStatus, CareStatus, StatusesHistory } from "../types/care.types";
import store from "../store/RootStore";
import i18next from "i18next";
import { TimelineItemProps } from "antd";

export const calculateNumberOfDays = (dateFrom: string, dateTo: string) => {
  const diff = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // + 1 to include the end date
  return days;
}

export const formatPrice = (price: number) => {
  return `${(price).toFixed(2).replace(".", ",")} zł`;
}

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
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
  statusesHistory: StatusesHistory;

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
    this.statusesHistory = data.statusesHistory;
  }

  get formattedDailyPrice(): string {
    return formatPrice(this.dailyPrice);
  }

  get totalPrice(): string {
    return formatPrice(this.numberOfDays * this.dailyPrice);
  }

  get numberOfDays() {
    const days = calculateNumberOfDays(this.careStart, this.careEnd);
    return days;
  }

  get isAbleToConfirmBeginOfCare() {
    return store.user.profile?.selected_profile === "CARETAKER" 
      && this.currentUserStatus === "READY_TO_PROCEED" 
      && this.careStart === getTodayDate()
  }

  get isStartTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.careStart === tomorrow.toISOString().split("T")[0];
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
      case "READY_TO_PROCEED":
        if (this.careStart === getTodayDate()) {
          return i18next.t("careStatus.waitingForCaretakerToConfirm")
        } else {
          return i18next.t("careStatus.waitingToTakePlace");
        }
      case "CONFIRMED":
        if (this.careEnd > getTodayDate()) {
          return i18next.t("careStatus.isTakingPlace");
        } else {
          return i18next.t("careStatus.done");
        }
      case "DONE":
        return i18next.t("careStatus.done");
      case "CANCELLED":
        return i18next.t("careStatus.cancelled");
      case "OUTDATED":
        return i18next.t("careStatus.outdated");
    }
  }

  get currentStatusColor() {
    console.log(this.currentUserStatus);
    switch(this.currentUserStatus) {
      case "PENDING":
        return "orange";
      case "ACCEPTED":
        if (this.otherUserStatus === "PENDING") {
          return "orange";
        } else {
          return "green";
        }
      case "READY_TO_PROCEED": 
        if (this.careStart === getTodayDate()) { // It is the moment for caretaker to confirm care
          return "orange";
        } else {
          return "blue";
        }
      case "CONFIRMED":
        if (this.careEnd > getTodayDate()) { // Care is taking place
          return "blue";
        } else {
          return "green";
        }
      case "CANCELLED":
        return "red";
      case "OUTDATED":
        return "gray";
    }
  }

  getStatusText(clientStatus: CareStatus, caretakerStatus: CareStatus, previous: CareHistoricalStatus | null) {
    switch(`${clientStatus}-${caretakerStatus}`) {
      case "ACCEPTED-PENDING":
        return i18next.t("careStatus.reported");
      case "PENDING-ACCEPTED":
        return i18next.t("careStatus.caretakerProposedNewPrice");
      case "READY_TO_PROCEED-READY_TO_PROCEED":
        if (previous?.clientStatus === "PENDING" && previous?.caretakerStatus === "ACCEPTED") {
          return i18next.t("careStatus.clientAcceptedNewPrice");
        } else {
          return i18next.t("careStatus.acceptedByCaretaker");
        }
      case "CONFIRMED-CONFIRMED":
        if (this.careEnd > getTodayDate()) {
          return i18next.t("careStatus.isTakingPlace");
        } else {
          return i18next.t("careStatus.done");
        }
      case "CANCELLED-CANCELLED":
        return i18next.t("careStatus.cancelled");
      case "OUTDATED-OUTDATED":
        return i18next.t("careStatus.outdated");
    }
  }

  get formattedSubmittedAt(){
    const dateTime = new Date(this.submittedAt);
    return dateTime.toLocaleString();
  }

  get timelineItemsOld() {
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
      return items;
    }

    // Check if care is pending, so need someone's action
    if (this.currentUserStatus === "PENDING") {
      items.push({
        color: "orange",
        children: i18next.t("careStatus.waitingForYourResponse")
      });
      return items;
    } else if (this.otherUserStatus === "PENDING") {
      items.push({
        color: "orange",
        children: i18next.t("careStatus.waitingForOtherResponse")
      });
      return items;
    }

    items.push({
      color: "green",
      children: i18next.t("careStatus.accepted")
    });

    // Check if care is ready to proceed
    if (this.currentUserStatus === "READY_TO_PROCEED") {
      if (this.careStart === getTodayDate()) {
        items.push({
          color: "orange",
          children: i18next.t("careStatus.waitingForCaretakerToConfirm")
        });
      } else {
        items.push({
          color: "blue",
          children: i18next.t("careStatus.waitingToTakePlace")
        });
      }
      return items;
    }

    if (this.currentUserStatus === "OUTDATED") {
      items.push({
        color: "gray",
        children: i18next.t("careStatus.outdated")
      });
      return items;
    }

    // Check if care is done
    if (this.currentUserStatus === "CONFIRMED") {
      if (this.careEnd > getTodayDate()) { // If care is taking place
        items.push({
          color: "blue",
          children: i18next.t("careStatus.isTakingPlace")
        });
      } else { // If care is done
        items.push({
          color: "green",
          children: i18next.t("careStatus.isTakingPlace")
        });
        items.push({
          color: "green",
          children: i18next.t("careStatus.done")
        });
      }
    }
  
    return items;
  }

  getHistoricalStatusColor(status: CareStatus) {
    switch(status) {
      case "PENDING":
      case "ACCEPTED":
      case "READY_TO_PROCEED":
      case "CONFIRMED":
        return "green";
      case "CANCELLED":
        return "red";
      case "OUTDATED":
        return "gray";
    }
  }

  getFormattedDateTime(value: string) {
    const dateTime = new Date(value);
    return dateTime.toLocaleString(
      [],
      { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  }

  get currentStatus() {
    const lastStatus = this.statusesHistory[this.statusesHistory.length - 1];

    switch(`${lastStatus.clientStatus}-${lastStatus.caretakerStatus}`) {
      case "ACCEPTED-PENDING":
        return i18next.t("careStatus.waitingForCaretakerResponse");
      case "PENDING-ACCEPTED":
        return i18next.t("careStatus.waitingForClientResponse");
      case "READY_TO_PROCEED-READY_TO_PROCEED":
        if (this.careStart === getTodayDate()) {
          return i18next.t("careStatus.waitingForCaretakerToConfirm")
        } else {
          return i18next.t("careStatus.waitingToTakePlace");
        }
      case "CONFIRMED-CONFIRMED":
        if (this.careEnd > getTodayDate()) {
          return i18next.t("careStatus.isTakingPlace");
        } else {
          return i18next.t("careStatus.done");
        }
      case "CANCELLED-CANCELLED":
        return i18next.t("careStatus.cancelled");
      case "OUTDATED-OUTDATED":
        return i18next.t("careStatus.outdated");
    }
  }

  get timelineItems() {
    const items: TimelineItemProps[] = this.statusesHistory.map((status, index) => {
      return {
        color: this.getHistoricalStatusColor(status.clientStatus),
        label: this.getFormattedDateTime(status.createdAt),
        children: this.getStatusText(
          status.clientStatus,
          status.caretakerStatus,
          this.statusesHistory[index - 1] || null
        )
      }
    })

    if (this.currentUserStatus !== "CANCELLED" && this.currentUserStatus !== "OUTDATED" 
      && this.currentUserStatus !== "CONFIRMED") {
      items.push({
        color: this.currentStatusColor,
        children: this.currentStatus
      });
    }


    return items;
  }
}
