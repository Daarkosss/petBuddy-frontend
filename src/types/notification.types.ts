import { PageableDTO, SortDTO } from "./pagination.types";

export type Notification = {
  createdAt: string;
  notificationId: number;
  objectId: number;
  objectType: string;
  messageKey: string;
  args: string[];
  receiverProfile: "CLIENT" | "CARETAKER" 
  read: boolean;
  dtype: string; 
}

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
}
