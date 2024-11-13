import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import { Button, Card, Rate, Upload, Avatar } from "antd";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import CommentContainer from "../components/CommentContainer";
import RoundedLine from "../components/RoundedLine";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import {
  CaretakerDetails,
  CaretakerRatingsResponse,
  OfferWithId,
} from "../types";
import OfferCard from "../components/Offer/OfferCard";
import ImgCrop from "antd-img-crop";
import { handleFilePreview, hasFilePhotoType } from "../functions/imageHandle";
import OfferManagement from "./OfferManagement";

const CaretakerProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const [profileData, setProfileData] = useState<CaretakerDetails>();
  const [offers, setOffers] = useState<OfferWithId[]>([]);

  const [isMyProfile, setIsMyProfile] = useState<boolean | null>(null);

  const [page, setPage] = useState<number>(0);
  const size = 10;
  const [ratings, setRatings] = useState<CaretakerRatingsResponse>();

  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 780px)").matches
  );

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const getCaretakerDetails = (email: string) => {
    api.getCaretakerDetails(email).then((data) => {
      setProfileData(data);
      setOffers(data.offers);
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
        isMyProfile ? store.user.profile!.selected_profile! : caretakerEmail!,
        page,
        size
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (caretakerEmail === store.user.profile?.email) {
      store.selectedMenuOption = "profile";
    }

    //if user is visiting their profile
    if (caretakerEmail === store.user.profile?.email) {
      //user is visiting their proifle
      setIsMyProfile(true);

      //which profile page should be showed
      if (store.user.profile!.selected_profile === "CARETAKER") {
        getCaretakerDetails(store.user.profile!.email!);
        getCaretakerRatings(store.user.profile!.email!, page, size);
      } else if (store.user.profile!.selected_profile === "CLIENT") {
        navigate("/profile-client");
      }
    } else {
      //if userEmail has been provided
      if (caretakerEmail !== null && caretakerEmail !== undefined) {
        getCaretakerDetails(caretakerEmail);
        getCaretakerRatings(caretakerEmail, page, size);
        setIsMyProfile(false);
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 780px)");
    const handleChange = (e: MediaQueryListEvent) =>
      setIsSmallScreen(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div>
      {profileData !== null && profileData !== undefined && (
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
                </div>
              )}
              <div className="profile-user">
                <div className="profile-user-nick">
                  <h1>
                    {profileData.accountData.name}{" "}
                    {profileData.accountData.surname}
                  </h1>
                  <h3>{t("profileSelection.caretaker")}</h3>
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
                  {!isMyProfile &&
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
            <div>
              {isSmallScreen && (
                <div className="profile-offers-smaller-screen">
                  {isMyProfile ? (
                    <OfferManagement
                      providedOffers={offers ?? []}
                      onOffersChange={(offers: OfferWithId[]) => {
                        console.log("setting offers");
                        console.log(JSON.stringify(offers));
                        setOffers(offers);
                      }}
                    />
                  ) : (
                    <>
                      <h1 className="profile-offers-label">
                        {t("profilePage.offers")}
                      </h1>

                      {offers !== null &&
                      offers !== undefined &&
                      offers.length > 0 ? (
                        offers.map((element, index) => (
                          <div
                            key={index}
                            className="profile-offer-card-smaller-screen"
                          >
                            <OfferCard
                              offer={element}
                              handleUpdateOffer={() => {}}
                              canBeEdited={false}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="profile-no-offers">
                          <Card>
                            <div>{t("profilePage.noOffersToShow")}</div>
                            <div className="profile-no-offers-add-offer-button">
                              <Button type="primary" className="add-button">
                                + {t("profilePage.addOffer")}
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <h1>{t("profilePage.ratings")}</h1>
              {isMyProfile === false &&
                store.user.profile?.selected_profile !== "CARETAKER" && (
                  <div className="profile-add-a-comment">
                    <Button type="primary" className="add-button">
                      {t("profilePage.rate")}
                    </Button>
                  </div>
                )}
              <div className="profile-comments-container">
                {ratings !== null &&
                ratings !== undefined &&
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
                )}
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

          {!isSmallScreen && (
            <div className="profile-right">
              {isMyProfile ? (
                <OfferManagement
                  providedOffers={offers ?? []}
                  onOffersChange={(offers: OfferWithId[]) => {
                    console.log("setting offers");
                    console.log(JSON.stringify(offers));
                    setOffers(offers);
                  }}
                />
              ) : (
                <>
                  <h1>{t("profilePage.offers")}</h1>
                  <div className="profile-right-offers">
                    {offers !== null &&
                    offers !== undefined &&
                    offers.length > 0 ? (
                      offers.map((element, index) => (
                        <div key={index}>
                          <OfferCard
                            offer={element}
                            handleUpdateOffer={() => {}}
                            canBeEdited={false}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="profile-no-offers">
                        <Card>
                          <div>{t("profilePage.noOffersToShow")}</div>
                        </Card>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaretakerProfile;
