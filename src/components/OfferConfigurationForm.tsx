import React, { useState } from "react";
import { Form, Input, Button, InputNumber, Select } from "antd";
import { OfferConfigurationDTO, OfferConfigurationWithId } from "../types";
import { useTranslation } from "react-i18next";

interface OfferConfigurationFormProps {
  initialValues: OfferConfigurationDTO;
  onSuccess: (values: OfferConfigurationWithId) => void;
}

const OfferConfigurationForm: React.FC<OfferConfigurationFormProps> = ({ initialValues, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = (values: OfferConfigurationWithId) => {
    setIsLoading(true);
    onSuccess(values);
    setIsLoading(false);
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item name="id" label="Id">
        <Input disabled/>
      </Form.Item>
      <Form.Item 
        name="description"
        label="Description"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="dailyPrice"
        label="Daily Price"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <InputNumber min={1} max={9999} />
      </Form.Item>
      <Form.Item 
        name={["selectedOptions", "SEX"]} 
        label="Sex"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Select 
          mode="multiple"
          placeholder={t("sex")} 
          options={[
            { value: "MALE", label: t("male") },
            { value: "SHE", label: t("she") }
          ]}
        />
      </Form.Item>
      <Form.Item
        name={["selectedOptions", "SIZE"]}
        label="Size"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Select
          mode="multiple"
          placeholder={t("size")}
          options={[
            { value: "SMALL", label: t("small") },
            { value: "BIG", label: t("big") }
          ]}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Save Configuration
      </Button>
    </Form>
  );
};

export default OfferConfigurationForm;
