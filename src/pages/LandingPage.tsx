import { Layout, Menu, Button, Form, Select, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import keycloak from "../Keycloack";
import { useTranslation } from "react-i18next";
import Voivodeship from "../models/Voivodeship";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";

const { Header, Content } = Layout;
const { Option } = Select;

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  return (
    <Layout>
      <Header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/favicon.png" alt="Logo" />
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Search caretakers</Menu.Item>
          <Menu.Item key="3">About Us</Menu.Item>
        </Menu>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <LanguageSwitcher />
          {keycloak.authenticated 
            ? <Button className="logout-button" onClick={() => keycloak.logout()}>
              {t("logout")}
            </Button>
            : <Button type="primary" className="login-button" onClick={() => keycloak.login()}>
              Login or Register
            </Button>
          }
        </div>
      </Header>

      <Content className="caretaker-section">
        <div className="caretaker-content">
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

        <div className="caretaker-image">
          <img src="/caretakerImage.png" alt="Dog and Woman" />
        </div>
      </Content>
    </Layout>
  );
};

export default LandingPage;
