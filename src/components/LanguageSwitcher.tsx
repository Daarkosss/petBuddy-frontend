import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import { FaGlobe } from "react-icons/fa";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const items = [
    {
      key: "en",
      label: "English",
      onClick: () => changeLanguage("en"),
    },
    {
      key: "pl",
      label: "Polski",
      onClick: () => changeLanguage("pl"),
    },
  ];

  return (
    <Dropdown
      menu={{items}}
      className="language-switcher"
      trigger={["click"]}
    >
      <FaGlobe />
    </Dropdown>
  );
};

export default LanguageSwitcher;
