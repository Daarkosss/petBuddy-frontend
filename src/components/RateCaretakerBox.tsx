import React, { useState } from "react";
import { Button, Input, List, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Rating {
  onSubmit: () => void;
  careId?: number;
}

const RateCaretakerBox: React.FC<Rating> = ({ onSubmit, careId }) => {
  const { t } = useTranslation();
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");

  const handleSubmit = async () => {
    if (careId !== null && careId !== undefined) {
      try {
        await api.rateCaretaker(careId, myRating, myComment);
        toast.success(t("success.rate"));
        onSubmit();
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(t("error.rate"));
          console.error(e.message);
        }
      }
    }
  };

  return (
    <List.Item
      className="chat-badge-list-item"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <List.Item.Meta
        description={
          <div className="rate-caretaker-box-description">
            {`${t("care.setRating")}:`}
            <div className="rate-caretaker-box-rating">
              <span>
                <StarFilled /> {`${myRating}/5.0`}
              </span>
              <Rate
                allowHalf
                value={myRating}
                onChange={(value) => setMyRating(value)}
              />
            </div>
            {`${t("care.writeAComment")}:`}
          </div>
        }
      />
      <div className="rate-caretaker-box-content">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 5 }}
          maxLength={500}
          onChange={(e) => setMyComment(e.target.value)}
        />
        <Button
          type="primary"
          className="add-button"
          onClick={() => handleSubmit()}
        >
          {t("care.submit")}
        </Button>
      </div>
    </List.Item>
  );
};

export default RateCaretakerBox;
