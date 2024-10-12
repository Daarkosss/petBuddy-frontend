import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { OfferDTO, OfferDTOWithId } from "../types";
import { api } from "../api/api";
import { toast } from "react-toastify";

interface OfferFormProps {
  offer?: OfferDTOWithId;
  onSuccess: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: OfferDTO) => {
    setIsLoading(true);
    try {
      await api.addOrEditOffer(values);
      toast.success(offer ? "Offer updated" : "Offer added");
      onSuccess();
    } catch (error) {
      toast.error("Failed to save offer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish} initialValues={offer}>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["animal", "animalType"]}
        label="Animal Type"
        rules={[{ required: true, message: "Please select an animal type" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        {offer ? "Save Changes" : "Add Offer"}
      </Button>
    </Form>
  );
};

export default OfferForm;
