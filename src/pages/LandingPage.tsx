// LandingPage.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { CaretakerSearchFilters } from "../types";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
// import { Value } from "react-multi-date-picker";

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<CaretakerSearchFilters>({
    personalDataLike: "",
    cityLike: "",
    voivodeship: undefined,
    animals: [],
    availabilities: [],
  });

  useEffect(() => {
    store.selectedMenuOption = "home";
  }, []);

  const handleSearch = async () => {
    sessionStorage.setItem("caretakerFilters", JSON.stringify(filters));
    navigate("/caretaker/search");
  };

  return (
    <div className="landing-page">
      <div className="main-text">
        <h2>{t("landingPage.title")}</h2>
        <p>{t("landingPage.subtitle")}</p>
      </div>

      <div className="main-image">
        <img src="/images/caretaker.jpg" alt="Dog and Man" />
      </div>

      <div className="search-container">
        <h3>{t("landingPage.searchTitle")}</h3>
        <SearchBar filters={filters} setFilters={setFilters} handleSearch={handleSearch} />
      </div>
    </div>
  );
};

export default LandingPage;
