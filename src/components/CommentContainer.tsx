import React, { useEffect, useState } from "react";
import testImg from "../../public/pet_buddy_logo.svg";
import { Button, Card, Rate, Select } from "antd";
import "../scss/components/_commentContainer.scss";
import RoundedLine from "./RoundedLine";
import { Input } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";

interface Rating {
  clientEmail: string;
  rating: number;
  comment: string;
  isRating?: boolean;
  onSubmit?: (myRating: number, myComment: string) => void;
  careId?: number;
}

const CommentContainer: React.FC<Rating> = ({
  clientEmail,
  rating,
  comment,
  isRating = false,
  onSubmit,
  careId,
}) => {
  const { t } = useTranslation();
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");

  const rate = async () => {
    if (careId !== null && careId !== undefined) {
      return api.rateCaretaker(careId, myRating, myComment);
    }
  };

  const handleSubmit = async () => {
    if (onSubmit !== null && onSubmit !== undefined) {
      rate().then((data) => {
        console.log("success");
        onSubmit(myRating, myComment);
      });
    }
  };

  return (
    <Card className="comment-container-main">
      <div className="comment-container-top">
        {isRating === false && (
          <div className="comment-container-user-rating">
            <img src={testImg} width={100} height={100} />
            <div className="comment-container-user-nick-container">
              <h5 className="comment-container-user-nick">{clientEmail}</h5>
            </div>
          </div>
        )}
        {isRating && <div>{t("profilePage.setRating")}:</div>}
        <div className="comment-container-rating">
          <span>
            <StarFilled /> {`${isRating === true ? myRating : rating}/5`}
          </span>
          <Rate
            disabled={!isRating}
            allowHalf
            value={isRating === true ? myRating : rating}
            onChange={(value) => setMyRating(value)}
          />
        </div>
      </div>
      <RoundedLine width={"100%"} height={"2px"} backgroundColor="#E1F7FF" />
      {isRating && <div>{t("profilePage.writeAComment")}:</div>}
      <div className="comment-container-bottom">
        {isRating === false ? (
          <p>{comment}</p>
        ) : (
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 5 }}
            maxLength={500}
            onChange={(e) => setMyComment(e.target.value)}
          />
        )}
        {isRating === true && (
          <Button
            type="primary"
            className="add-button"
            onClick={() => (isRating === true ? handleSubmit() : null)}
          >
            {t("profilePage.submit")}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CommentContainer;
