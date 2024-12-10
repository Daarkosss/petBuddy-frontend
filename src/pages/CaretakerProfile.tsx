import React, { useEffect, useState } from "react";
import store from "../store/RootStore";
import "../scss/pages/_profile.scss";
import {
  Button,
  Card,
  Rate,
  Upload,
  Avatar,
  Image,
  Popover,
  Popconfirm,
  List,
} from "antd";
import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import RoundedLine from "../components/RoundedLine";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";
import {
  CaretakerDetails,
  CaretakerRatingsResponse,
  OfferWithId,
  UserBlockInfo,
} from "../types";
import OfferCard from "../components/Offer/OfferCard";
import ImgCrop from "antd-img-crop";
import { handleFilePreview, hasFilePhotoType } from "../functions/imageHandle";
import OfferManagement from "./OfferManagement";
import { toast } from "react-toastify";
import { round } from "lodash";

interface CaretakerProfileProps {
  handleSetOpenChat?: (
    recipientEmail: string | undefined,
    profilePicture: string | undefined,
    name: string | undefined,
    surname: string | undefined,
    profile: string | undefined,
    shouldOpenMaximizedChat?: boolean,
    shouldOpenMinimizedChat?: boolean
  ) => void;
  didCurrentlyLoggedUserBlocked?: (otherUserEmail: string) => Promise<boolean>;
  setVisitingProfile?: (profile: string) => void;
  triggerReload?: boolean;
  handleBlockUnblockUser?: (userEmail: string, option: string) => void;
}

const CaretakerProfile: React.FC<CaretakerProfileProps> = ({
  handleSetOpenChat,
  didCurrentlyLoggedUserBlocked,
  setVisitingProfile,
  triggerReload,
  handleBlockUnblockUser,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const [profileData, setProfileData] = useState<CaretakerDetails>();
  const [offers, setOffers] = useState<OfferWithId[]>([]);

  const [isMyProfile, setIsMyProfile] = useState<boolean | null>(null);

  const [ratings, setRatings] = useState<CaretakerRatingsResponse>();

  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    size: 5,
    current: 1,
    total: 0,
  });

  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 5,
  });

  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 780px)").matches
  );

  const handleOnPageChange = (page: number, pageSize?: number) => {
    setPagingParams({
      page: page - 1,
      size: pageSize || 5,
    });
  };

  useEffect(() => {
    const getRatings = async () => {
      await getCaretakerRatings();
    };
    getRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const handleFollow = async () => {
    if (profileData?.accountData.email) {
      try {
        await api.followCaretaker(profileData?.accountData.email);
        setIsFollowed(true);
        toast.success(t("success.followCaretaker"));
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(t("error.followCaretaker"));
        }
      }
    }
  };

  const handleUnfollow = async () => {
    if (profileData?.accountData.email) {
      try {
        await api.unfollowCaretaker(profileData?.accountData.email);
        setIsFollowed(false);
        toast.success(t("success.unfollowCaretaker"));
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(t("error.unfollowCaretaker"));
        }
      }
    }
  };

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [blockInfo, setBlockInfo] = useState<UserBlockInfo>({
    isBlocked: false,
    whichUserBlocked: undefined,
  });
  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] =
    useState<boolean>(false);

  const checkWhoBlocked = async (
    otherUserName: string,
    otherUserSurname: string,
    otherUserEmail: string
  ) => {
    const result = await didCurrentlyLoggedUserBlocked!(otherUserEmail);
    if (result) {
      setBlockInfo({
        isBlocked: true,
        whichUserBlocked: {
          name: store.user.profile!.firstName!,
          surname: store.user.profile!.lastName!,
          email: store.user.profile!.email!,
        },
      });
    } else {
      setBlockInfo({
        isBlocked: true,
        whichUserBlocked: {
          name: otherUserName,
          surname: otherUserSurname,
          email: otherUserEmail,
        },
      });
    }
  };

  const checkIfFollowed = async () => {
    const response = await api.getFollowedCaretakers();
    if (response) {
      for (let i = 0; i < response.length; i++) {
        if (response[i].email === profileData?.accountData.email) {
          setIsFollowed(true);
          return true;
        }
      }
    }
    setIsFollowed(false);
    return false;
  };

  const getCaretakerDetails = (email: string) => {
    api.getCaretakerDetails(email).then((data) => {
      if (setVisitingProfile) {
        setVisitingProfile(data.accountData.email);
      }
      setProfileData(data);
      setOffers(data.offers);
      if (data.accountData.profilePicture !== null) {
        setProfilePicture(data.accountData.profilePicture.url);
      }
      if (data.blocked) {
        checkWhoBlocked(
          data.accountData.name,
          data.accountData.surname,
          data.accountData.email
        );
      } else {
        setBlockInfo!({ isBlocked: false, whichUserBlocked: undefined });
      }
    });
  };

  const getCaretakerRatings = async () => {
    if (profileData) {
      api
        .getCaretakerRatings(profileData.accountData.email, pagingParams)
        .then((data) => {
          console.log(data);
          setRatings({ ...data });
          setPagination({
            size: data.pageable.pageSize,
            current: data.pageable.pageNumber + 1,
            total: data.totalElements,
          });
        });
    }
  };

  useEffect(() => {
    // If user is visiting their profile
    if (caretakerEmail === store.user.profile?.email) {
      store.selectedMenuOption = "profile";
      setIsMyProfile(true);

      // Which profile page should be showed
      if (store.user.profile!.selected_profile === "CARETAKER") {
        getCaretakerDetails(store.user.profile!.email!);
      } else if (store.user.profile!.selected_profile === "CLIENT") {
        navigate("/profile-client");
      }
    } else {
      // If userEmail has been provided
      if (caretakerEmail !== null && caretakerEmail !== undefined) {
        getCaretakerDetails(caretakerEmail);
        setIsMyProfile(false);
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 780px)");
    const handleChange = (e: MediaQueryListEvent) =>
      setIsSmallScreen(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReload]);

  useEffect(() => {
    checkIfFollowed();
    getCaretakerRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
                {profileData.offerPhotos &&
                  profileData.offerPhotos.length > 0 && (
                    <div className="background-images">
                      <Image.PreviewGroup>
                        {profileData.offerPhotos.map((photo, index) => (
                          <Image
                            key={index}
                            src={photo.url}
                            preview={{
                              mask: <span>{t("clickToZoom")}</span>,
                            }}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
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
                      disabled={blockInfo.isBlocked}
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
                      profileData.avgRating !== null
                        ? round(profileData.avgRating, 2)
                        : 0
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
                        {!isFollowed && (
                          <Button
                            type="primary"
                            className="profile-action-button"
                            onClick={() => handleFollow()}
                          >
                            {t("profilePage.followCaretaker")}
                          </Button>
                        )}

                        {isFollowed && (
                          <Popconfirm
                            title={t("profilePage.unfollowCaretaker")}
                            description={t("profilePage.sureToUnfollow")}
                            onConfirm={() => {
                              handleUnfollow();
                            }}
                            okText={t("yes")}
                            cancelText={t("no")}
                          >
                            <Button danger type="primary">
                              {t("profilePage.unfollowCaretaker")}
                            </Button>
                          </Popconfirm>
                        )}

                        {blockInfo.isBlocked && (
                          <Popover
                            content={t("blockOpenChat")}
                            title={
                              blockInfo.whichUserBlocked?.email ===
                              store.user.profile.email
                                ? t("chatBlockade")
                                : t("youHaveBeenBlocked")
                            }
                          >
                            <Button disabled>{t("chatBlockade")}</Button>
                          </Popover>
                        )}

                        {!blockInfo.isBlocked && (
                          <Button
                            type="primary"
                            className="profile-action-button"
                            onClick={() => {
                              handleSetOpenChat!(
                                profileData.accountData.email,
                                profileData.accountData.profilePicture?.url ||
                                  undefined,
                                profileData.accountData.name,
                                profileData.accountData.surname,
                                "caretaker"
                              );
                            }}
                          >
                            {t("profilePage.openChat")}
                          </Button>
                        )}

                        {blockInfo.isBlocked &&
                          blockInfo.whichUserBlocked?.email ===
                            store.user.profile.email && (
                            <Popconfirm
                              open={showDeleteConfirmationPopup}
                              title={t("sureToUnblock")}
                              onConfirm={() => {
                                setShowDeleteConfirmationPopup(false);
                                handleBlockUnblockUser!(
                                  profileData.accountData.email,
                                  "unblockUser"
                                );
                              }}
                              onCancel={() =>
                                setShowDeleteConfirmationPopup(false)
                              }
                              okText={t("yes")}
                              cancelText={t("no")}
                            >
                              <Button
                                type="primary"
                                className="profile-action-button"
                                onClick={() => {
                                  setShowDeleteConfirmationPopup(true);
                                }}
                              >
                                {t("unblockUser")}
                              </Button>
                            </Popconfirm>
                          )}
                        {!blockInfo.isBlocked && (
                          <Popconfirm
                            open={showDeleteConfirmationPopup}
                            title={t("sureToBlock")}
                            description={t("blockInfo")}
                            onConfirm={() => {
                              setShowDeleteConfirmationPopup(false);
                              handleBlockUnblockUser!(
                                profileData.accountData.email,
                                "blockUser"
                              );
                            }}
                            onCancel={() =>
                              setShowDeleteConfirmationPopup(false)
                            }
                            okText={t("yes")}
                            cancelText={t("no")}
                          >
                            <Button
                              type="primary"
                              className="profile-action-button"
                              onClick={() =>
                                setShowDeleteConfirmationPopup(true)
                              }
                            >
                              {t("blockUser")}
                            </Button>
                          </Popconfirm>
                        )}
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
              <div>
                {profileData.description ?? t("profilePage.noDescription")}
              </div>
            )}
            <div>
              {isSmallScreen && (
                <div className="profile-offers-smaller-screen">
                  {isMyProfile ? (
                    <OfferManagement
                      providedOffers={offers ?? []}
                      onOffersChange={(offers: OfferWithId[]) => {
                        setOffers(offers);
                      }}
                    />
                  ) : (
                    <>
                      <h1 className="profile-offers-label">
                        {t("profilePage.offers")}
                      </h1>

                      {offers && offers.length > 0 ? (
                        offers.map((element, index) => (
                          <div
                            key={index}
                            className="profile-offer-card-smaller-screen"
                          >
                            <OfferCard
                              offer={element}
                              handleUpdateOffer={() => {}}
                              canBeEdited={false}
                              isBlocked={blockInfo.isBlocked}
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
                store.user.profile?.selected_profile === "CLIENT" && (
                  <Link
                    to={"/cares"}
                    className="profile-add-a-comment"
                    style={{ textDecoration: "none" }}
                  >
                    {t("profilePage.rate")}
                  </Link>
                )}
              <List
                itemLayout="vertical"
                dataSource={ratings?.content}
                locale={{ emptyText: t("noData") }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.size,
                  total: pagination.total,
                  onChange: handleOnPageChange,
                }}
                renderItem={(item) => (
                  <List.Item
                    className="chat-badge-list-item"
                    extra={
                      <div className="chat-badge-extra">
                        <Rate disabled allowHalf value={item.rating} />
                      </div>
                    }
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.client.accountData.profilePicture?.url}
                          icon={
                            item.client.accountData.profilePicture
                              ?.url ? null : (
                              <UserOutlined />
                            )
                          }
                          size={50}
                        />
                      }
                      title={
                        <div className="chat-badge-title">
                          {item.client.accountData.name}{" "}
                          {item.client.accountData.surname}
                        </div>
                      }
                      description={item.client.accountData.email}
                    />
                    {item.comment}
                  </List.Item>
                )}
              />
            </div>
          </div>

          {!isSmallScreen && (
            <div className="profile-right">
              {isMyProfile ? (
                <OfferManagement
                  providedOffers={offers ?? []}
                  onOffersChange={(offers: OfferWithId[]) => {
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
                            isBlocked={blockInfo.isBlocked}
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
