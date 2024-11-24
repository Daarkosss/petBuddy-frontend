import React, { useState } from "react";
import "../scss/components/_chatBottom.scss";
import { Button, Input } from "antd";
import { MoreOutlined, SendOutlined } from "@ant-design/icons";
import "../scss/components/_buttons.scss";

interface ChatBottomParameters {
  onSend: (input: string) => any;
}

const ChatBottom: React.FC<ChatBottomParameters> = ({ onSend }) => {
  const [input, setInput] = useState<string>("");

  const onKeyDown = (e: string) => {
    if (e !== undefined) {
      if (e === "Enter") {
        onSend(input);
        setInput("");
      }
    }
  };

  return (
    <div className="chat-bottom-container">
      <MoreOutlined size={90} />
      <Input
        placeholder="Write message..."
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(e) => onKeyDown(e.code)}
        value={input}
      />
      <Button
        type="primary"
        className="send-message-button"
        onClick={() => {
          setInput("");
          onSend(input);
        }}
      >
        <SendOutlined />
      </Button>
    </div>
  );
};

export default ChatBottom;