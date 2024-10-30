import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import testImg from "../../public/pet_buddy_logo.svg";
import { Button, Card, Rate } from "antd";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { CaretakerDetailsDTO, UserProfiles } from "../types";

function ClientProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const location = useLocation();

  // const { userEmail } = location.state || {};
  // const { isUserProfile } = location.state || {};
  // const [isProfileDataFetched, setIsProfileDataFetched] = useState(false);
  const [profileData, setProfileData] = useState<UserProfiles>();

  // const testList = [1, 2, 3, 4, 5, 6, 7];

  const getClientDetails = () => {
    api.getUserProfiles().then((data) => {
      setProfileData(data);
    });
  };

  useEffect(() => {
    //if user is here, they has to visit their profile
    store.selectedMenuOption = "profile";

    //which profile page should be showed
    if (store.user.profile!.selected_profile === "CLIENT") {
      getClientDetails();
    } else if (store.user.profile!.selected_profile === "CARETAKER") {
      navigate("/profile-caretaker");
    }
  }, []);
  return (
    <div>
      {profileData != null ? (
        <div className="profile-container">
          <div className="profile-left-data">
            <div className="profile-left-upper-container">
              <div>
                <img src={testImg} className="profile-image" />
                <Button type="primary" className="profile-action-button">
                  {t("profilePage.changeImage")}
                </Button>
              </div>
            </div>
          </div>
          <div className="profile-right">
            <div className="profile-client-data-container">
              <Card className="profile-client-card">
                <div className="profile-user">
                  <div className="profile-user-nick">
                    <h1>
                      {profileData.accountData.name}{" "}
                      {profileData.accountData.surname}
                    </h1>
                  </div>
                </div>
                <div>
                  <h2>{t("profilePage.userClientProfile")}</h2>
                  <RoundedLine
                    width={"100%"}
                    height={"2px"}
                    backgroundColor="#003459"
                  />
                </div>
                {profileData.hasCaretakerProfile ? (
                  <div>
                    <Button
                      type="primary"
                      className="profile-action-button"
                      onClick={() => {
                        store.user.setSelectedProfile("CARETAKER");
                        store.user.saveProfileToStorage(store.user.profile);
                        navigate("/profile-caretaker");
                      }}
                    >
                      {t("profilePage.changeToCaretakerProfile")}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3>{t("profilePage.noCaretakerProfile")}</h3>
                    <Button
                      type="primary"
                      onClick={() => navigate("/caretaker/form")}
                    >
                      + {t("profileSelection.createCaretaker")}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}

export default ClientProfile;
