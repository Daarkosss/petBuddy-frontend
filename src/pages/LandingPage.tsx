import { Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { useEffect, useState } from "react";
import store from "../store/RootStore";
import { AnimalSex, CaretakerSearchFilters } from "../types";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<CaretakerSearchFilters>({
    personalDataLike: "",
    cityLike: "",
    voivodeship: undefined,
    animals: [],
  });

  useEffect(() => {
    store.selectedMenuOption = "home";
  }, []);

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, cityLike: e.target.value }));
  };

  const handleVoivodeshipChange = (value: string) => {
    setFilters((prev) => ({ ...prev, voivodeship: value }));
  };

  const handleAnimalTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      animals: [{ animalType: value, offerConfigurations: [] }],
    }));
  };

  const handleSexChange = (value: string) => {
    setFilters((prev) => {
      if (!prev.animals) {
        return prev;
      }
      
      return {
        animals: [{ 
          ...prev.animals[0],
          offerConfigurations: [{
            attributes: {
              SEX: [value as AnimalSex],
            },
          }],
        }],
      };
    });
  };
  
  const handleSearch = async () => {
    console.log("filters", filters);
    navigate("/caretaker/search", { state: { filters } });
  };

  return (
    <div className="landing-page">
      <div className="main-content">
        <h2>{t("landingPage.title")}</h2>
        <p>{t("landingPage.subtitle")}</p>
      </div>

      <div className="search-container">
        <h3>{t("landingPage.searchTitle")}</h3>
        <div className="search-fields">
          <Form layout="inline" className="search-form">
            <Form.Item
              layout="vertical"
              label={t("addressDetails.city")}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder={t("placeholder.city")}
                className="input-field"
                value={filters.cityLike}
                onChange={handleCityChange}
              />
            </Form.Item>
            <Form.Item layout="vertical" label={t("addressDetails.voivodeship")}>
              <Select
                placeholder={t("placeholder.voivodeship")}
                className="input-field"
                allowClear
                style={{ width: "200px" }}
                value={filters.voivodeship}
                onChange={handleVoivodeshipChange}
              >
                {renderSelectOptions(Voivodeship.voivodeshipMap)}
              </Select>
            </Form.Item>

            <Form.Item layout="vertical" label={t("caretakerSearch.animalType")}>
              <Select
                className="search-select"
                placeholder={t("placeholder.animalType")}
                onChange={handleAnimalTypeChange}
              >
                {renderSelectOptions({
                  DOG: t("dog"),
                  CAT: t("cat"),
                  BIRD: t("bird"),
                  REPTILE: t("reptile"),
                  HORSE: t("horse"),
                })}
              </Select>
            </Form.Item>

            <Form.Item layout="vertical" label={t("sex")}>
              <Select disabled={!filters.animals?.[0]}
                className="search-select"
                placeholder={t("placeholder.sex")}
                onChange={handleSexChange}
              >
                {renderSelectOptions({ MALE: t("male"), SHE: t("she") })}
              </Select>
            </Form.Item>

            <Button className="search-button" onClick={handleSearch} icon={<SearchOutlined />}>
              {t("search")}
            </Button>
          </Form>
        </div>
      </div>

      <div className="main-image">
        <img src="/caretakerImage.png" alt="Dog and Woman" />
      </div>
    </div>
  );
};

export default LandingPage;
