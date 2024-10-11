import React, { useState } from "react";
import "../scss/components/_chatBottom.scss";

function ChatBottom() {
  const [input, setInput] = useState<string>("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="chat-bottom-container">
      <div>opcje</div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">{">"}</button>
      </form>
    </div>
  );
}

export default ChatBottom;
