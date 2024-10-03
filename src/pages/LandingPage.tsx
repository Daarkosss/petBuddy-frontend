import { Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { useEffect } from "react";
import store from "../store/RootStore";

const { Option } = Select;

const LandingPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    store.selectedMenuKey = "home";
  }, []);

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  return (
    <div className="landing-page">
      <div className="main-content">
        <h1>Welcome to Pet Buddy, a place where you can find a pet caretaker or start taking care of lovely pets</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>

      <div className="search-container">
        <h3>Find the best caretaker for your pet</h3>
        <Form layout="inline" className="search-form">
          <Form.Item 
            layout="vertical"
            label={t("addressDetails.city")}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder={t("addressDetails.city")}
              className="input-field"
              // onPressEnter={handleSearch}
              />
          </Form.Item>
          <Form.Item layout="vertical" label={t("addressDetails.voivodeship")}>
          <Select
            placeholder={t("addressDetails.voivodeship")}
            className="input-field"
            // onChange={(value) => onFiltersChange({ ...filters, voivodeship: value })}
            allowClear
            style={{ width: "200px" }}
            // value={filters.voivodeship}
          >
            {renderSelectOptions(Voivodeship.voivodeshipMap)}
          </Select>
          </Form.Item >

          <Form.Item layout="vertical" label={t("caretakerSearch.animalType")}>
            <Select className="search-select">
              <Option value="Dog">Dog</Option>
              <Option value="Cat">Cat</Option>
              <Option value="Bird">Bird</Option>
            </Select>
          </Form.Item>

          <Form.Item layout="vertical" label={t("sex")}>
            <Select className="search-select">
              <Option value="She">She</Option>
              <Option value="Male">Male</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="main-image">
        <img src="/caretakerImage.png" alt="Dog and Woman" />
      </div>
    </div>
  );
};

export default LandingPage;
