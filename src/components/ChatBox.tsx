import React from "react";
import ChatTopBar from "./ChatTopBar";
import ChatMessages from "./ChatMessages";
import ChatBottom from "./ChatBottom";
import "../scss/components/_chatBox.scss";

function ChatBox() {
  return (
    <div className="chat-box-main-container">
      <div className="chat-box-inner-container">
        <ChatTopBar />
        <ChatMessages />
        <ChatBottom />
      </div>
    </div>
  );
}

export default ChatBox;
