import React from "react";
import testImg from "../../public/favicon.png";
import "../scss/components/_chatTopBar.scss";

function ChatTopBar() {
  return (
    <div className="chat-top-bar-container">
      <div className="comment-container-top">
        <div className="comment-container-user-rating">
          <img src={testImg} />
          <div className="comment-container-user-nick-container">
            <h5 className="comment-container-user-nick">Some user</h5>
            <p>Client</p>
          </div>
        </div>
        <p>24.07.2024</p>
      </div>
    </div>
  );
}

export default ChatTopBar;
