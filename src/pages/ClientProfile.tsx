import { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import {
  Avatar,
  Button,
  Card,
  GetProp,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import RoundedLine from "../components/RoundedLine";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { UserProfiles } from "../types";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { toast } from "react-toastify";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function ClientProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfiles>();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getClientDetails = () => {
    api.getUserProfiles().then((data) => {
      setProfileData(data);
      if (data.accountData.profilePicture !== null) {
        setProfilePicture(data.accountData.profilePicture.url);
      }
    });
  };

  const handleFileChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    newFileList[0].originFileObj;
    try {
      const respone = await api.uploadProfilePicture(newFileList[0]);
      if (respone.profilePicture !== null)
        setProfilePicture(respone.profilePicture.url);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(`ERROR: ${e.message}`);
      }
    }
    setFileList([]);
  };

  const hasFilePhotoType = (file: UploadFile) => {
    const allowedFormats = [
      "image/jpeg",
      "image/webp",
      "image/png",
      "image/jpg",
    ];
    if (!file.type || !allowedFormats.includes(file.type)) {
      toast.error(t("error.wrongFileTypeForPhoto"));
      return false;
    }
    return true;
  };

  const handleFilePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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
                  customRequest={dummyRequest}
                  fileList={fileList}
                  showUploadList={false}
                  name="file"
                  onChange={handleFileChange}
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
