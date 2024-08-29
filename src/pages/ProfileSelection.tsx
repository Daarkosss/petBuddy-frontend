import React from "react";
import "../scss/pages/_profileSelection.scss";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import ProfileSelectionBox from "../components/ProfileSelectionBox";
import { CgProfile } from "react-icons/cg";
import { Header } from "../components/Header";
import RoundedLine from "../components/RoundedLine";

const ProfileSelection: React.FC = () => {
  const { t } = useTranslation();

  // useEffect(() => {
  //     store.reset();
  //   }, []);

  return (
    <>
      <Header />
      <div className="selection-main-container">
        <h1 className="selection-title">{t("profileSelection.title")}</h1>
        <RoundedLine width="40%" height="5px" backgroundColor="#007EA7" />
        <div className="selection-nested-container">
          <ProfileSelectionBox
            icon={CgProfile}
            size={100}
            title={t("profileSelection.client")}
          />

          {/*TODO: remember to add logic that allows to add caretaker profile if needed!*/}
          {/* <h3 className="profile-title">{t("profileSelection.caretaker")}</h3> */}
          <ProfileSelectionBox
            icon={IoAddCircleOutline}
            size={100}
            title={t("profileSelection.createCaretaker")}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileSelection;
