import { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import { Avatar, Button, Card, Upload } from "antd";
import RoundedLine from "../components/RoundedLine";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { UserProfiles } from "../types";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { handleFilePreview, hasFilePhotoType } from "../functions/imageHandle";
import { toast } from "react-toastify";
import { HandleSetOpenChat } from "../types/chat.types";

const ClientProfile: React.FC<HandleSetOpenChat> = ({ handleSetOpenChat }) => {
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
      toast.success(t("success.changeProfilePicture"));
    } catch (e: unknown) {
      onError?.(e);
      if (e instanceof Error) {
        console.error(`ERROR: ${e.message}`);
      }
      toast.error(t("error.changeProfilePicture"));
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
          <div
            className="profile-left-data"
            style={{
              backgroundColor: "#003459",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card style={{ maxWidth: "500px" }}>
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
                <div className="my-actions">
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
              </div>
              <div
                className="profile-offers-smaller-screen"
                style={{ backgroundColor: "white" }}
              >
                <div className="profile-client-data-container-smaller-screen">
                  <Card className="profile-client-card">
                    <div className="profile-user">
                      <div className="profile-user-nick">
                        <h1>
                          {profileData.accountData.name}{" "}
                          {profileData.accountData.surname}
                        </h1>
                        <p
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {profileData.accountData.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5>{t("profilePage.userClientProfile")}</h5>
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
                            handleSetOpenChat!(
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              false,
                              false
                            );
                            store.user.setSelectedProfile("CARETAKER");
                            store.user.saveProfileToStorage(store.user.profile);
                            navigate(
                              `/profile-caretaker/${store.user.profile?.email}`
                            );
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
            </Card>
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
};

export default ClientProfile;
