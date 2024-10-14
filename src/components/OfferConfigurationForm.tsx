import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, Select } from "antd";
import { OfferConfigurationWithId } from "../types";
import { useTranslation } from "react-i18next";

interface OfferConfigurationFormProps {
  initialValues: OfferConfigurationWithId | null;
  onSuccess: (values: OfferConfigurationWithId) => void;
}

const OfferConfigurationForm: React.FC<OfferConfigurationFormProps> = ({ initialValues, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = (values: OfferConfigurationWithId) => {
    setIsLoading(true);
    onSuccess(values);
    form.resetFields();
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      onFinish={handleFinish}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item 
        name="description"
        label={t("description")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="dailyPrice"
        label={t("dailyPrice")} 
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <InputNumber min={1} max={9999} />
      </Form.Item>
      <Form.Item 
        name={["selectedOptions", "SEX"]} 
        label={t("sex")} 
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
        label={t("size")}
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
        {t("save")}
      </Button>
    </Form>
  );
};

export default OfferConfigurationForm;
