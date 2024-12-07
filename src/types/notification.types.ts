import { PageableDTO, SortDTO } from "./pagination.types";
import { AccountDataDTO } from "./user.types";

export type Notification = {
  createdAt: string;
  notificationId: number;
  objectId: number;
  objectType: string;
  messageKey: string;
  args: string[];
  receiverProfile: "CLIENT" | "CARETAKER";
  triggeredBy: AccountDataDTO;
  read: boolean;
  dtype: string;
};

export type ChatMessageNotification = {
  dtype: string;
  unseenChatsAsClient: number;
  unseenChatsAsCaretaker: number;
};

export type NotificationDTO = {
  content: Notification[];
  pageable: PageableDTO;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: SortDTO[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type NumberOfUnreadChats = {
  createdAt: string;
  unseenChatsAsClient: number;
  unseenChatsAsCaretaker: number;
};
