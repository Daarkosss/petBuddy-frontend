import React from "react";
import ChatTopBar from "./ChatTopBar";
import ChatMessages from "./ChatMessages";
import ChatBottom from "./ChatBottom";
import "../scss/components/_chatBox.scss";

function ChatBox() {
  const mockupMessages = [
    {
      id: 1,
      chatId: 1,
      senderEmail: "kuba.staniszewski.ks@gmail.com",
      content: "Hello",
      createdAt: "2024-10-12T11:44:26.078Z",
      seenByRecipient: true,
    },
    {
      id: 2,
      chatId: 1,
      senderEmail: "test@gmail.com",
      content: "Hello there!",
      createdAt: "2024-10-12T11:45:26.078Z",
      seenByRecipient: true,
    },
  ];

  const onSend = (input: string) => {
    console.log(input);
  };

  return (
    <div className="chat-box-main-container">
      <div className="chat-box-inner-container">
        <ChatTopBar />
        <ChatMessages messages={mockupMessages} />
        <ChatBottom onSend={onSend} />
      </div>
    </div>
  );
}

export default ChatBox;
