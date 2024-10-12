import React, { useState } from "react";
import "../scss/components/_chatBottom.scss";

interface ChatBottomParameters {
  onSend: (input: string) => any;
}

const ChatBottom: React.FC<ChatBottomParameters> = ({ onSend }) => {
  const [input, setInput] = useState<string>("");

  return (
    <div className="chat-bottom-container">
      <div>opcje</div>
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button onClick={() => onSend(input)}>{">"}</button>
    </div>
  );
};

export default ChatBottom;
