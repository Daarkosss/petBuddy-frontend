import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import { Header } from "../components/Header";
import testImg from "../../public/favicon.png";
import { Rate } from "antd";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { CaretakerDetailsDTO, UserProfiles } from "../types";

function ClientProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { userEmail } = location.state || {};
  const { isUserProfile } = location.state || {};
  const [isProfileDataFetched, setIsProfileDataFetched] = useState(false);
  const [profileData, setProfileData] = useState<UserProfiles>();

  const testList = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    if (store.user.profile?.selected_profile == null) {
      navigate("/profile-selection");
    } else {
      if (
        userEmail == null ||
        userEmail == store.user.profile!.selected_profile
      ) {
        if (store.user.profile!.selected_profile === "Client") {
          api.getUserProfiles().then((data) => {
            setProfileData(data);
            setIsProfileDataFetched(true);
          });
        } else if (store.user.profile!.selected_profile === "Caretaker") {
          navigate("/profile-caretaker", { state: { userEmail: userEmail } });
        }
      }
    }
  }, []);
  return (
    <div>
      <Header />
      {store.user.profile != null &&
      store.user.profile?.selected_profile === "Client" ? (
        <div className="profile-container">
          <div className="profile-left-data">
            <div className="profile-left-upper-container">
              <img width={400} src={testImg} />
              <div className="profile-user">
                <h1 className="profile-user-nick">
                  {profileData?.accountData.name}{" "}
                  {profileData?.accountData.surname} - Client
                </h1>
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

            {profileData?.hasCaretakerProfile ? (
              <a>See caretaker profile</a>
            ) : (
              <div>
                <h3>Currently you do not have caretaker profile</h3>
                <a>+ Create caretaker profile</a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}

export default ClientProfile;
