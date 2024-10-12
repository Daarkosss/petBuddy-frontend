export type ChatRoom = {
  id: number;
  chatterEmail: string;
  chatterName: string;
  chatterSurname: string;
  lastMessageCreatedAt: string;
  lastMessage: string;
  lastMessageSendBy: string;
  seenByPrincipal: boolean;
};
