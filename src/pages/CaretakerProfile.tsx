import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import {
  Button,
  Card,
  GetProp,
  Rate,
  Upload,
  UploadFile,
  UploadProps,
  Avatar,
} from "antd";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import { CaretakerDetails, CaretakerRatingsResponse } from "../types";
import OfferCard from "../components/Offer/OfferCard";
import ImgCrop from "antd-img-crop";
import { toast } from "react-toastify";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CaretakerProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail } = location.state || {};
  const [profileData, setProfileData] = useState<CaretakerDetails>();

  const [isMyProfile, setIsMyProfile] = useState<boolean | null>(null);

  const [page, setPage] = useState<number>(0);
  const size = 10;
  const [ratings, setRatings] = useState<CaretakerRatingsResponse>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const getCaretakerDetails = (email: string) => {
    api.getCaretakerDetails(email).then((data) => {
      setProfileData(data);
      if (data.accountData.profilePicture !== null) {
        setProfilePicture(data.accountData.profilePicture.url);
      }
    });
  };

  const getCaretakerRatings = (
    email: string,
    page: number | null,
    size: number | null
  ) => {
    api.getCaretakerRatings(email, page, size, null, null).then((data) => {
      setRatings({ ...data });
    });
  };

  useEffect(() => {
    if (isMyProfile !== null) {
      getCaretakerRatings(
        isMyProfile === true ? store.user.profile!.selected_profile : userEmail,
        page,
        size
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    store.selectedMenuOption = "profile";

    //if user is visiting their profile
    if (
      userEmail === null ||
      userEmail === undefined ||
      userEmail === store.user.profile?.selected_profile
    ) {
      //user is visiting their proifle
      setIsMyProfile(true);

      //which profile page should be showed
      if (store.user.profile!.selected_profile === "CARETAKER") {
        getCaretakerDetails(store.user.profile!.email!);
        getCaretakerRatings(store.user.profile!.email!, page, size);
      } else if (store.user.profile!.selected_profile === "CLIENT") {
        navigate("/profile-caretaker", { state: { userEmail: userEmail } });
      }
    } else {
      //if userEmail has been provided
      if (userEmail !== null && userEmail !== undefined) {
        getCaretakerDetails(userEmail);
        getCaretakerRatings(userEmail, page, size);
        setIsMyProfile(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

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
              {isMyProfile === true && (
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
              )}
              <div className="profile-user">
                <div className="profile-user-nick">
                  <h1>
                    {profileData.accountData.name}{" "}
                    {profileData.accountData.surname}
                  </h1>
                  <h3> - {t("profileSelection.caretaker")}</h3>
                </div>
                <div className="profile-rating">
                  <span>
                    (
                    {`${
                      profileData.avgRating !== null ? profileData.avgRating : 0
                    }/ 5.0`}
                    )
                  </span>
                  <Rate
                    disabled
                    allowHalf
                    value={
                      profileData.avgRating !== null ? profileData.avgRating : 0
                    }
                    className="profile-rating-stars"
                  />
                  <span>({profileData.numberOfRatings})</span>
                </div>
                <div className="profile-actions">
                  {isMyProfile === false &&
                    store.user.profile?.selected_profile === "CLIENT" && (
                      <div className="profile-actions">
                        <Button
                          type="primary"
                          className="profile-action-button"
                        >
                          {t("profilePage.followCaretaker")}
                        </Button>
                        <Button
                          type="primary"
                          className="profile-action-button"
                        >
                          {t("profilePage.openChat")}
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div>
              <h2>{t("profilePage.userCaretakerProfile")}</h2>
              <RoundedLine
                width={"100%"}
                height={"2px"}
                backgroundColor="#003459"
              />
            </div>
            {isMyProfile === true && (
              <div>
                <Button
                  type="primary"
                  className="profile-action-button"
                  onClick={() => {
                    navigate("/caretaker/form");
                  }}
                >
                  {t("profilePage.editProfile")}
                </Button>
              </div>
            )}
            <h4>{t("profilePage.description")}</h4>
            {profileData !== null && profileData !== undefined && (
              <div>{profileData.description}</div>
            )}

            {isMyProfile === true && (
              <div>
                <Button
                  type="primary"
                  className="profile-action-button"
                  onClick={() => {
                    store.user.setSelectedProfile("CLIENT");
                    store.user.saveProfileToStorage(store.user.profile);
                    navigate("/profile-client");
                  }}
                >
                  {t("profilePage.changeToClientProfile")}
                </Button>
              </div>
            )}
            <div>
              <div className="profile-offers-smaller-screen">
                <h1>{t("profilePage.offers")}</h1>
                {/* divider */}
                {profileData !== null && profileData !== undefined ? (
                  profileData.offers.length > 0 ? (
                    profileData.offers.map((element, index) => (
                      <div
                        key={index}
                        className="profile-offer-card-smaller-screen"
                      >
                        <OfferCard
                          offer={element}
                          handleUpdateOffer={() => {}}
                          canBeEdited={isMyProfile ?? false}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="profile-no-offers">
                      <Card>
                        <div>{t("profilePage.noOffersToShow")}</div>
                        {isMyProfile === true && (
                          <div className="profile-no-offers-add-offer-button">
                            <Button type="primary" className="add-button">
                              + {t("profilePage.addOffer")}
                            </Button>
                          </div>
                        )}
                      </Card>
                    </div>
                  )
                ) : null}
              </div>

              <h1>{t("profilePage.ratings")}</h1>
              {/* divider */}
              {isMyProfile === false &&
                store.user.profile?.selected_profile !== "CARETAKER" && (
                  <div className="profile-add-a-comment">
                    <Button type="primary" className="add-button">
                      {t("profilePage.rate")}
                    </Button>
                  </div>
                )}

              <div className="profile-comments-container">
                {ratings !== null && ratings !== undefined ? (
                  ratings.content.length > 0 ? (
                    ratings!.content.map((element, index) => (
                      <div key={index}>
                        <CommentContainer
                          clientEmail={element.clientEmail}
                          rating={element.rating}
                          comment={element.comment}
                        />
                      </div>
                    ))
                  ) : (
                    <div>{t("profilePage.noRatingsToShow")}</div>
                  )
                ) : null}
              </div>
              {ratings !== null &&
                ratings !== undefined &&
                ratings.content.length > 0 && (
                  <div className="profile-comments-page">
                    <div className="profile-comments-page-buttons">
                      <Button
                        type="primary"
                        className="profile-action-button"
                        onClick={() => {
                          if (page > 0) {
                            setPage((prevPage) => prevPage - 1);
                          }
                        }}
                      >
                        {"<"}
                      </Button>
                      <Button
                        type="primary"
                        className="profile-action-button"
                        onClick={() => {
                          if (ratings !== null) {
                            if (
                              page + 1 <
                              Math.floor(profileData.numberOfRatings / size)
                            ) {
                              setPage((prevPage) => prevPage + 1);
                            }
                          }
                        }}
                      >
                        {">"}
                      </Button>
                    </div>
                    <div>
                      {t("profilePage.page")}:{" "}
                      {`${page + 1} / ${Math.floor(
                        profileData.numberOfRatings / size
                      )}`}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="profile-right">
            <h1>{t("profilePage.offers")}</h1>
            <div className="profile-right-offers">
              {/* divider */}
              {profileData !== null ? (
                profileData.offers.length > 0 ? (
                  profileData.offers.map((element, index) => (
                    <div key={index}>
                      <OfferCard
                        offer={element}
                        handleUpdateOffer={() => {}}
                        canBeEdited={isMyProfile ?? false}
                      />
                    </div>
                  ))
                ) : (
                  <div className="profile-no-offers">
                    <Card>
                      <div>{t("profilePage.noOffersToShow")}</div>
                      {isMyProfile === true && (
                        <div className="profile-no-offers-add-offer-button">
                          <Button type="primary" className="add-button">
                            + {t("profilePage.addOffer")}
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
};

export default CaretakerProfile;
