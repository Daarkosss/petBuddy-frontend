import { useState } from "react";
import { Form, Input, Button, GetProp, Upload, UploadProps, UploadFile, Select, Card, Space } from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { api } from "../api/api";
import { FormAddress } from "../types";
import Voivodeship from "../models/Voivodeship";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CaretakerForm = () => {
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<FormAddress>({
    city: "",
    zipCode: "",
    voivodeship: undefined,
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
  });

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const renderSelectOptions = (options: Record<string, string>) => {
    return Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete"];
    const regex = /^[0-9-]*$/;
    if (!regex.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete"];
    const regex = /^[0-9+]*$/;
    if (!regex.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }

  const handleSubmit = () => {
    // fileList.forEach((file, index) => {
    //   if (file.originFileObj) {
    //     formData.append(`image_${index}`, file.originFileObj);
    //   }
    // });

    api.editCaretakerProfile({
      phoneNumber,
      description,
      address
    });
  };

  return (
    <div>
      <Header />
      <div className="caretaker-form-container">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card title={t("address")}>
              <div className="card-grid-row">
                <Form.Item
                  label={t("addressDetails.street")}
                  name="street"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    value={address.street}
                    maxLength={150}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder={t("placeholder.street")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.buildingNumber")}
                  name="buildingNumber"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    value={address.buildingNumber}
                    maxLength={10}
                    onChange={(e) => handleAddressChange("buildingNumber", e.target.value)}
                    placeholder={t("placeholder.buildingNumber")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.apartmentNumber")}
                  name="apartmentNumber"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    value={address.apartmentNumber}
                    maxLength={10}
                    onChange={(e) => handleAddressChange("apartmentNumber", e.target.value)}
                    placeholder={t("placeholder.apartmentNumber")}
                  />
                </Form.Item>
              </div>

              <div className="card-grid-row">
                <Form.Item
                  label={t("addressDetails.zipCode")}
                  name="zipCode"
                  rules={[
                    { required: true, message: t("validation.required") },
                    { pattern: /^[0-9]{2}-[0-9]{3}$/, message: t("validation.zipCodeFormat") }
                  ]}
                >
                  <Input
                    value={address.zipCode}
                    maxLength={6}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    onKeyDown={(e) => handleZipCodeKeyDown(e)}
                    placeholder={t("placeholder.zipCode")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.city")}
                  name="city"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    value={address.city}
                    maxLength={50}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder={t("placeholder.city")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.voivodeship")}
                  name="voivodeship"
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Select
                    value={address.voivodeship}
                    onChange={(value) => handleAddressChange("voivodeship", value)}
                    placeholder={t("placeholder.voivodeship")}
                  >
                    {renderSelectOptions(Voivodeship.voivodeshipMap)}
                  </Select>
                </Form.Item>
              </div>
            </Card>

            <Card title={t("personalData.contactDetails")}>
              <Form.Item
                label={t("personalData.phoneNumber")}
                name="phoneNumber"
                rules={[
                  { required: true, message: t("validation.required") },
                  { pattern: /^\+?([0-9]){7,}$/, message: t("validation.phoneNumberFormat") },
                ]}
                style={{ width: "200px" }}
              >
                <Input
                  value={phoneNumber}
                  maxLength={14}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={handlePhoneNumberKeyDown}
                  placeholder={t("placeholder.phoneNumber")}
                />
              </Form.Item>
            </Card>

            <Card title={t("description")}>
              <Form.Item name="description">
                <Input.TextArea
                  showCount 
                  autoSize={{
                    minRows: 2,
                    maxRows: 4,
                  }}
                  maxLength={1500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholder.description")}
                />
              </Form.Item>
            </Card>

            <Card title={t("uploadImages")}>
              <Form.Item name="images">
                <ImgCrop rotationSlider>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    accept="image/*"
                  >
                    {fileList.length < 5 && `+ ${t("upload")}`}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Card>

            <Button type="primary" htmlType="submit">
              {t("save")}
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
