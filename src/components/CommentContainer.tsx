import React from "react";
import testImg from "../../public/pet_buddy_logo.svg";
import { Card, Rate } from "antd";
import "../scss/components/_commentContainer.scss";
import RoundedLine from "./RoundedLine";

interface Rating {
  clientEmail: string;
  rating: number;
  comment: string;
}

const CommentContainer: React.FC<Rating> = ({
  clientEmail,
  rating,
  comment,
}) => {
  return (
    <Card className="comment-container-main">
      <div className="comment-container-top">
        <div className="comment-container-user-rating">
          <img src={testImg} width={100} height={100} />
          <div className="comment-container-user-nick-container">
            <h5 className="comment-container-user-nick">{clientEmail}</h5>
          </div>
        </div>
        <div className="comment-container-rating">
          <span>({`${rating} / 5`})</span>
          <Rate disabled allowHalf value={rating} />
        </div>
      </div>
      <RoundedLine width={"100%"} height={"2px"} backgroundColor="#E1F7FF" />
      <div className="comment-container-bottom">
        <p>{comment}</p>
      </div>
    </Card>
  );
};

export default CommentContainer;
