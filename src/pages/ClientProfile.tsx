import { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import {
  Avatar,
  Button,
  Card,
  Upload,
} from "antd";
import RoundedLine from "../components/RoundedLine";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { UserProfiles } from "../types";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { handleFilePreview, hasFilePhotoType } from "../functions/imageHandle";


function ClientProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfiles>();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const getClientDetails = () => {
    api.getUserProfiles().then((data) => {
      setProfileData(data);
      if (data.accountData.profilePicture !== null) {
        setProfilePicture(data.accountData.profilePicture.url);
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCustomPhotoRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      const response = await api.uploadProfilePicture(file);
      if (response.profilePicture !== null) {
        setProfilePicture(response.profilePicture.url);
      }
      onSuccess?.("ok");
    } catch (e: unknown) {
      onError?.(e);
      if (e instanceof Error) {
        console.log(`ERROR: ${e.message}`);
      }
    }
  };

  useEffect(() => {
    //if user is here, they has to visit their profile
    store.selectedMenuOption = "profile";

    //which profile page should be showed
    if (store.user.profile!.selected_profile === "CLIENT") {
      getClientDetails();
    } else if (store.user.profile!.selected_profile === "CARETAKER") {
      navigate(`/profile-caretaker/${store.user.profile?.email}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {profileData !== null && profileData !== undefined ? (
        <div className="profile-container">
          <div className="profile-left-data">
            <div className="profile-left-upper-container">
              <div className="profile-picture-container">
                {profilePicture !== null ? (
                  <img src={profilePicture} className="profile-image" />
                ) : (
                  <Avatar
                    size={250}
                    className="profile-image"
                    icon={<UserOutlined />}
                  />
                )}
              </div>
              <ImgCrop rotationSlider beforeCrop={hasFilePhotoType}>
                <Upload
                  customRequest={handleCustomPhotoRequest}
                  showUploadList={false}
                  name="file"
                  onPreview={handleFilePreview}
                  accept="image/*"
                >
                  <Button
                    icon={<PictureOutlined />}
                    type="primary"
                    className="profile-action-button"
                  >
                    {t("profilePage.changeImage")}
                  </Button>
                </Upload>
              </ImgCrop>
            </div>

            <div className="profile-offers-smaller-screen">
              <div className="profile-client-data-container-smaller-screen">
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
                          navigate(`/profile-caretaker/${store.user.profile?.email}`);
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
                        className="profile-action-button"
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
                        navigate(`/profile-caretaker/${store.user.profile?.email}`);
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
                      className="profile-action-button"
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
