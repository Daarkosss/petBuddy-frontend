import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={<FaGlobe />}
      variant="light"
      className="language-switcher"
    >
      <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
      <Dropdown.Item onClick={() => changeLanguage("pl")}>Polski</Dropdown.Item>
    </DropdownButton>
  );
};

export default LanguageSwitcher;
