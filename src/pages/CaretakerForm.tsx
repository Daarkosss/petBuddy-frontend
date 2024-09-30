import { useState } from "react";
import { Form, Input, Button, GetProp, Upload, UploadProps, UploadFile, Select, Card, Space } from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { api } from "../api/api";
import { CaretakerFormFields } from "../types";
import Voivodeship from "../models/Voivodeship";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CaretakerForm = () => {
  const { t } = useTranslation();

  const [fileList, setFileList] = useState<UploadFile[]>([]); // Not send to backend yet, will be done when backend is ready
  const [form] = Form.useForm<CaretakerFormFields>();
  const allowedSpecialKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

  const handleFileChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFilePreview = async (file: UploadFile) => {
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

  const renderSelectOptions = (options: Record<string, string>) => (
    Object.entries(options).map(([value, label]) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ))
  );

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDownForNumeric(e);

    const zipCode = form.getFieldValue(["address", "zipCode"]);
    if (zipCode && zipCode.length === 2 && !allowedSpecialKeys.includes(e.key)) {
      form.setFieldsValue({
        address: {
          ...form.getFieldValue("address"),
          zipCode: `${zipCode}-`,
        },
      });
    }
  };

  const handleKeyDownForNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    const isDigit = /[0-9]/.test(char);
    if (!isDigit && !allowedSpecialKeys.includes(char)) {
      e.preventDefault();
    }
  }

  const handleSubmit = () => {
    api.getUserProfiles().then((userProfiles) => {
      if (userProfiles.hasCaretakerProfile) {
        api.editCaretakerProfile(form.getFieldsValue());
      } else {
        api.addCaretakerProfile(form.getFieldsValue());
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="caretaker-form-container">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card title={t("address")}>
              <div className="card-grid-row">
                <Form.Item
                  label={t("addressDetails.street")}
                  name={["address", "street"]}
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    maxLength={150}
                    placeholder={t("placeholder.street")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.buildingNumber")}
                  name={["address", "buildingNumber"]}
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    maxLength={10}
                    placeholder={t("placeholder.buildingNumber")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.apartmentNumber")}
                  name={["address", "apartmentNumber"]}
                >
                  <Input
                    maxLength={10}
                    placeholder={t("placeholder.apartmentNumber")}
                  />
                </Form.Item>
              </div>

              <div className="card-grid-row">
                <Form.Item
                  label={t("addressDetails.zipCode")}
                  name={["address", "zipCode"]}
                  rules={[
                    { required: true, message: t("validation.required") },
                    { pattern: /^[0-9]{2}-[0-9]{3}$/, message: t("validation.zipCodeFormat") }
                  ]}
                >
                  <Input
                    maxLength={6}
                    onKeyDown={handleZipCodeKeyDown}
                    placeholder={t("placeholder.zipCode")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.city")}
                  name={["address", "city"]}
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Input
                    maxLength={50}
                    placeholder={t("placeholder.city")}
                  />
                </Form.Item>
                <Form.Item
                  label={t("addressDetails.voivodeship")}
                  name={["address", "voivodeship"]}
                  rules={[{ required: true, message: t("validation.required") }]}
                >
                  <Select placeholder={t("placeholder.voivodeship")}>
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
                  { pattern: /^([0-9]){9,14}$/, message: t("validation.phoneNumberFormat") },
                ]}
                style={{ width: "200px" }}
              >
                <Input
                  maxLength={14}
                  placeholder={t("placeholder.phoneNumber")}
                  onKeyDown={handleKeyDownForNumeric}
                  addonBefore="+48"
                />
              </Form.Item>
            </Card>

            <Card title={t("description")}>
              <Form.Item name="description">
                <Input.TextArea
                  showCount
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  maxLength={1500}
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
                    onChange={handleFileChange}
                    onPreview={handleFilePreview}
                    accept="image/*"
                  >
                    {fileList.length < 5 && `+ ${t("upload")}`}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Card>

            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              {t("save")}
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
