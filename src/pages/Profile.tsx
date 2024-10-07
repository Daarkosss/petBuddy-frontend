import React from "react";
// import store from "../store/RootStore"; //Temporary for tests
import "../scss/pages/_profile.scss";
import { Header } from "../components/Header";
import testImg from "../../public/favicon.png";
import { Rate } from "antd";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";

const Profile: React.FC = () => {
  const testList = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-left-data">
          <div className="profile-left-upper-container">
            <img width={400} src={testImg} />
            <div className="profile-user">
              <h1 className="profile-user-nick">Jan Kowalski - Client</h1>
              <div className="profile-rating">
                <span>({"4.0 / 5.0"})</span>
                <Rate
                  disabled
                  allowHalf
                  value={4}
                  className="profile-rating-stars"
                />
                <span>({20})</span>
              </div>
            </div>
          </div>
          <div>
            <h2>User caretaker profile</h2>
            <RoundedLine
              width={"100%"}
              height={"2px"}
              backgroundColor="#007ea7"
            />
          </div>
          <h3>Currently you do not have caretaker profile</h3>
          <a>+ Create caretaker profile</a>
        </div>

        <div className="profile-right-comments">
          <h1>Comments</h1>
          {/* divider */}
          {testList.map((element, index) => (
            <CommentContainer />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
