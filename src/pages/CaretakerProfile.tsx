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
import { CaretakerDetailsDTO } from "../types";
import OfferCard from "../components/Offer/OfferCard";

const CaretakerProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail } = location.state || {};
  const [isProfileDataFetched, setIsProfileDataFetched] = useState(false);
  const [profileData, setProfileData] = useState<CaretakerDetailsDTO>();
  const [hasClientProfile, setHasClientProfile] = useState<boolean | null>();
  const [hasCaretakerProfile, setHasCaretakerProfile] = useState<
    boolean | null
  >();

  const [isMyProfile, setIsMyProfile] = useState<boolean | null>(null);

  const testList = [1, 2, 3, 4, 5, 6, 7];

  const getCaretakerDetails = (email: string) => {
    api.getCaretakerDetails(email).then((data) => {
      setProfileData(data);
      console.log(`profile data offers: ${JSON.stringify(data.offers)}`);
      setIsProfileDataFetched(true);
    });
  };

  const checkUserAvailableProfiles = () => {
    api.getUserProfiles().then((data) => {
      setHasClientProfile(data.hasClientProfile);
      setHasCaretakerProfile(data.hasCaretakerProfile);
    });
  };

  useEffect(() => {
    store.selectedMenuOption = "home";

    //if user is visiting their profile
    if (
      userEmail == null ||
      userEmail == store.user.profile?.selected_profile
    ) {
      //user is visiting their proifle
      setIsMyProfile(true);

      //which profile page should be showed
      if (store.user.profile!.selected_profile === "CARETAKER") {
        getCaretakerDetails(store.user.profile!.email!);
      } else if (store.user.profile!.selected_profile === "CLIENT") {
        navigate("/profile-caretaker", { state: { userEmail: userEmail } });
      }
      checkUserAvailableProfiles();
    } else {
      //if userEmail has been provided
      if (userEmail != null) {
        getCaretakerDetails(userEmail);
        setIsMyProfile(false);
      }

      //else -> not allowed navigation, redirect needed
    }
  }, []);
  return (
    <div>
      {profileData != null ? (
        <div className="profile-container">
          <div className="profile-left-data">
            <div className="profile-left-upper-container">
              <div>
                <img width={400} src={testImg} className="profile-image" />

                {isMyProfile == true && (
                  <Button type="primary">Change image</Button>
                )}
              </div>
              <div className="profile-user">
                <div className="profile-user-nick">
                  <h1>{profileData.accountData.name}</h1>
                  <h3> - Caretaker</h3>
                </div>
                <div className="profile-rating">
                  <span>
                    (
                    {`${
                      profileData.avgRating != null ? profileData.avgRating : 0
                    }/ 5.0`}
                    )
                  </span>
                  <Rate
                    disabled
                    allowHalf
                    value={
                      profileData.avgRating != null ? profileData.avgRating : 0
                    }
                    className="profile-rating-stars"
                  />
                  <span>({profileData.numberOfRatings})</span>
                </div>
                <div className="profile-actions">
                  {isMyProfile == false &&
                    store.user.profile?.selected_profile === "CLIENT" && (
                      <div className="profile-actions">
                        <Button type="primary">Follow caretaker</Button>
                        <Button type="primary">Open chat</Button>
                      </div>
                    )}
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
            <h4>Description</h4>
            {profileData != null && <div>{profileData.description}</div>}
            {/* {isMyProfile == true &&
              hasClientProfile != null &&
              (hasClientProfile ? (
                <div>
                  <h3>Currently you do not have caretaker profile</h3>
                  <a>+ Create caretaker profile</a>
                </div>
              ) : (
                <div>
                  <a>Visit your client profile</a>
                </div>
              ))} */}

            {isMyProfile == true && (
              <div>
                <button
                  onClick={() => {
                    store.user.setSelectedProfile("CLIENT");
                    store.user.saveProfileToStorage(store.user.profile);
                    navigate("/profile-client");
                  }}
                >
                  <h3>Change to client profile</h3>
                </button>
              </div>
            )}
            <div>
              <h1>Comments</h1>
              {/* divider */}
              {isMyProfile == false && (
                <Button type="primary">Add comment</Button>
              )}
              {testList.map((element, index) => (
                <div key={index}>
                  <CommentContainer />
                </div>
              ))}
            </div>
          </div>

          <div className="profile-right">
            <h1>Offers</h1>
            <div className="profile-right-offers">
              {/* divider */}
              {profileData != null ? (
                profileData.offers.length > 0 ? (
                  profileData.offers.map((element, index) => (
                    <div key={index}>
                      <OfferCard
                        offer={element}
                        handleUpdateOffer={(e, b) => {}}
                        // canBeEdited={isMyProfile}
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <div>Currently there are no offers to show</div>
                    {isMyProfile == true && (
                      <button>
                        <h3>+ Add offer</h3>
                      </button>
                    )}
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
