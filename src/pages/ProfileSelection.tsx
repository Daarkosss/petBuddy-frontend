import React, { useEffect, useState } from "react";
import "../scss/pages/_profileSelection.scss";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuHelpingHand } from "react-icons/lu";
import ProfileSelectionBox from "../components/ProfileSelectionBox";
import { CgProfile } from "react-icons/cg";
import { Header } from "../components/Header";
import RoundedLine from "../components/RoundedLine";
import { api } from "../api/api";

interface ProfileSelectionProps {
  // to be able to know when user data is fetched
  //only then we can modify profile
  isUserDataFetched: boolean;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({
  isUserDataFetched,
}) => {
  const { t } = useTranslation();

  const [hasCaretakerProfile, setHasCaretakerProfile] = useState(false);
  const [isRequesting, setIsRequesting] = useState(true);

  useEffect(() => {
    const getUserProfiles = async () => {
      try {
        const userProfiles = await api.getUserProfiles();
        if ("hasCaretakerProfile" in userProfiles) {
          setHasCaretakerProfile(userProfiles.hasCaretakerProfile);
          setIsRequesting(false);
        }
      } catch (error) {
        console.log("Failed to fetch user profiles data");
      }
    };

    getUserProfiles();
  }, []);

  return (
    <>
      <Header />
      <div className="selection-main-container">
        <h1 className="selection-title">{t("profileSelection.title")}</h1>
        <RoundedLine width="40%" height="5px" backgroundColor="#007EA7" />

        {!isRequesting && isUserDataFetched && (
          <div className="selection-nested-container">
            <ProfileSelectionBox
              icon={CgProfile}
              size={100}
              title={t("profileSelection.client")}
              profile={"Client"}
            />
            {hasCaretakerProfile === true ? (
              <ProfileSelectionBox
                icon={LuHelpingHand}
                size={100}
                title={t("caretaker")}
                profile={"Caretaker"}
              />
            ) : (
              <ProfileSelectionBox
                icon={IoAddCircleOutline}
                size={100}
                title={t("profileSelection.createCaretaker")}
                profile={null}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSelection;
