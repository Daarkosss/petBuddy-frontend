import { PageableDTO, SortDTO } from "./pagination.types";
import { Photo } from "./user.types";

export interface HandleSetOpenChat {
  handleSetOpenChat?: (
    recipientEmail: string | undefined,
    profilePicture: string | undefined,
    name: string | undefined,
    surname: string | undefined,
    profile: string | undefined,
    shouldOpenMaximizedChat?: boolean,
    shouldOpenMinimizedChat?: boolean
  ) => void;
}

export type ChatMessage = {
  id: number;
  chatId: number;
  senderEmail: string;
  content: string;
  createdAt: string;
  seenByRecipient: boolean;
};

export type ChatMessagesResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ChatMessage[];
  number: number;
  sort: SortDTO;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableDTO;
  empty: boolean;
};

export type WebsocketResponse = {
  type: string;
  content: ChatMessage;
  chatId?: number;
  joiningUserEmail?: string;
  blockType?: string;
};

export type ChatsResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Chat[];
  number: number;
  sort: SortDTO;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableDTO;
  empty: boolean;
};

export type Chat = {
  id: number;
  chatter: {
    email: string;
    name: string;
    surname: string;
    profilePicture: Photo | null;
  };
  lastMessage: {
    id: number;
    chatId: number;
    senderEmail: string;
    content: string;
    createdAt: string;
    seenByRecipient: boolean;
  };
  blocked: boolean;
};

export type ChatBlockInfo = {
  isChatRoomBlocked: boolean;
  whichUserBlocked:
    | { name: string; surname: string; email: string }
    | undefined;
};
