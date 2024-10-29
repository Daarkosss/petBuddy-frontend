import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import testImg from "../../public/pet_buddy_logo.svg";
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

  const [isMyProfile, setIsMyProfile] = useState<boolean | null>(null);

  const testList = [1, 2, 3, 4, 5, 6, 7];

  const getClientDetails = () => {
    api.getUserProfiles().then((data) => {
      setProfileData(data);
    });
  };

  useEffect(() => {
    //if user is here, they has to visit their profile
    store.selectedMenuOption = "home";

    //which profile page should be showed
    if (store.user.profile!.selected_profile === "CLIENT") {
      getClientDetails();
    } else if (store.user.profile!.selected_profile === "CARETAKER") {
      navigate("/profile-caretaker");
    }
  }, []);
  return (
    <div>
      {store.user.profile != null &&
      store.user.profile?.selected_profile === "CLIENT" ? (
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
              <h2>User client profile</h2>
              <RoundedLine
                width={"100%"}
                height={"2px"}
                backgroundColor="#007ea7"
              />
            </div>

            {/* {profileData?.hasCaretakerProfile ? (
              <a>See caretaker profile</a>
            ) : (
              <div>
                <h3>Currently you do not have caretaker profile</h3>
                <a>+ Create caretaker profile</a>
              </div>
            )} */}
            {profileData != null ? (
              profileData?.hasCaretakerProfile ? (
                <div>
                  <button
                    onClick={() => {
                      store.user.setSelectedProfile("CARETAKER");
                      store.user.saveProfileToStorage(store.user.profile);
                      navigate("/profile-caretaker");
                    }}
                  >
                    <h3>Change to caretaker profile</h3>
                  </button>
                </div>
              ) : (
                <div>
                  <h3>Currently you do not have caretaker profile</h3>
                  <button onClick={() => navigate("/caretaker/form")}>
                    + Create caretaker profile
                  </button>
                </div>
              )
            ) : null}
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}

export default ClientProfile;
