import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import { Header } from "../components/Header";
import testImg from "../../public/favicon.png";
import { Rate } from "antd";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileDataFetched, setIsProfileDataFetched] = useState(false);

  const testList = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    if (false) {
      //TODO: temporary. Put !store.user.profile?.selected_profile later
      navigate("/profile-selection");
    } else {
      try {
        // api.getCaretakerProfile("");
      } catch (error: unknown) {}
    }
  }, []);
  return (
    <div>
      <Header />
      {store.user.profile != null && true ? ( //TODO: temporary. Put store.user.profile?.selected_profile === "Caretaker" later
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
      ) : (
        <div>Not implemented yet</div>
      )}
    </div>
  );
};

export default Profile;
