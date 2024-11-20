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

  get currentStatusColor() {
    switch(`${this.clientStatus}-${this.caretakerStatus}`) {
      case "PENDING-ACCEPTED":
      case "ACCEPTED-PENDING":
        return "orange";
      case "READY_TO_PROCEED-READY_TO_PROCEED": 
        if (this.careStart === getTodayDate()) { // Day of care begin, the caretaker should confirm care
          return "orange";
        } else if (this.careStart > getTodayDate()) { // Waiting for care to begin
          return "blue";
        } else { // Care is outdated, caretaker didn't confirm it in time
          return "gray";
        }
      case "CONFIRMED-CONFIRMED":
        if (this.careEnd > getTodayDate()) { // Care is taking place
          return "blue";
        } else { // Care is done
          return "green";
        }
      case "CANCELLED-CANCELLED":
        return "red";
      case "OUTDATED-OUTDATED":
        return "gray";
    }
  }

  get currentStatusText() {
    switch(`${this.clientStatus}-${this.caretakerStatus}`) {
      case "ACCEPTED-PENDING":
        return i18next.t("careStatus.waitingForCaretakerResponse");
      case "PENDING-ACCEPTED":
        return i18next.t("careStatus.waitingForClientResponse");
      case "READY_TO_PROCEED-READY_TO_PROCEED":
        if (this.careStart === getTodayDate()) {
          return i18next.t("careStatus.waitingForCaretakerToConfirm")
        } else if (this.careStart > getTodayDate()) {
          return i18next.t("careStatus.waitingToTakePlace");
        } else {
          return i18next.t("careStatus.outdated")
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

  getHistoricalStatusText(
    clientStatus: CareStatus,
    caretakerStatus: CareStatus,
    previous: CareHistoricalStatus | null
  ) {
    switch(`${clientStatus}-${caretakerStatus}`) {
      case "ACCEPTED-PENDING":
        return i18next.t("careStatus.reported");
      case "PENDING-ACCEPTED":
        return i18next.t("careStatus.newPriceProposedByCaretaker");
      case "READY_TO_PROCEED-READY_TO_PROCEED":
        if (previous?.clientStatus === "PENDING" && previous?.caretakerStatus === "ACCEPTED") {
          return i18next.t("careStatus.newPriceAcceptedByClient");
        } else {
          return i18next.t("careStatus.acceptedByCaretaker");
        }
      case "CONFIRMED-CONFIRMED":
        return i18next.t("careStatus.startConfirmedByCaretaker");
      case "CANCELLED-CANCELLED":
        return i18next.t("careStatus.cancelled");
      case "OUTDATED-OUTDATED":
        return i18next.t("careStatus.outdated");
    }
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

  get formattedSubmittedAt(){
    const dateTime = new Date(this.submittedAt);
    return dateTime.toLocaleString();
  }

  getFormattedDateTime(value: string) {
    const dateTime = new Date(value);
    return dateTime.toLocaleString(
      [],
      { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  }

  get isRejected() {
    return this.currentUserStatus === "CANCELLED" || this.currentUserStatus === "OUTDATED";
  }

  get timelineItems() {
    const items: TimelineItemProps[] = this.statusesHistory.map((status, index) => {
      return {
        color: this.getHistoricalStatusColor(store.user.profile?.selected_profile === "CLIENT"
           ? status.clientStatus
           : status.caretakerStatus
        ),
        label: this.getFormattedDateTime(status.createdAt),
        children: this.getHistoricalStatusText(
          status.clientStatus,
          status.caretakerStatus,
          this.statusesHistory[index - 1] || null
        )
      }
    })

    if (!this.isRejected) {
      items.push({
        color: this.currentStatusColor,
        children: this.currentStatusText
      });
    }

    return items;
  }
}
