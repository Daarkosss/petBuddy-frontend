import React, { useState } from "react";
import { Form, Input, Button, InputNumber } from "antd";
import { OfferConfigurationDTO } from "../types";
import { api } from "../api/api";
import { toast } from "react-toastify";

interface OfferConfigurationFormProps {
  configurationId?: number;
  initialValues?: OfferConfigurationDTO;
  onSuccess: () => void;
}

const OfferConfigurationForm: React.FC<OfferConfigurationFormProps> = ({ configurationId, initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: OfferConfigurationDTO) => {
    setIsLoading(true);
    try {
      if (configurationId) {
        await api.editOfferConfiguration(configurationId, values);
      } else {
        // await api.addOrEditOfferConfiguration(values);
      }
      toast.success("Configuration saved successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish} initialValues={initialValues}>
      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>
      <Form.Item name="dailyPrice" label="Daily Price">
        <InputNumber min={1} max={9999} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Save Configuration
      </Button>
    </Form>
  );
};

export default OfferConfigurationForm;
