import React from "react";
import testImg from "../../public/favicon.png";
import { Card, Rate } from "antd";
import "../scss/components/_commentContainer.scss";
import RoundedLine from "./RoundedLine";

const CommentContainer: React.FC = () => {
  return (
    <Card className="comment-container-main">
      <div className="comment-container-top">
        <div className="comment-container-user-rating">
          <img src={testImg} />
          <div className="comment-container-user-nick-container">
            <h5 className="comment-container-user-nick">Some user</h5>
            <p>Client</p>
          </div>
          <div className="comment-container-rating">
            <span>({"4.0 / 5.0"})</span>
            <Rate
              disabled
              allowHalf
              value={4}
              className="comment-container-rating-stars"
            />
          </div>
        </div>
        <p>24.07.2024</p>
      </div>
      <RoundedLine width={"100%"} height={"2px"} backgroundColor="#E1F7FF" />
      <div className="comment-container-bottom">
        <p>Jakiś komentarz</p>
      </div>
    </Card>
  );
};

export default CommentContainer;
