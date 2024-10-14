import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { OfferDTO, OfferDTOWithId } from "../types";
import { api } from "../api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface OfferFormProps {
  offer?: OfferDTOWithId;
  onSuccess: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, onSuccess }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: OfferDTO) => {
    setIsLoading(true);
    try {
      await api.addOrEditOffer(values);
      toast.success(offer ? t("success.editOffer") : t("success.addOffer"));
      onSuccess();
    } catch (error) {
      toast.error(offer ? t("error.editOffer") : t("error.addOffer"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish} initialValues={offer}>
      <Form.Item
        name="description"
        label={t("description")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["animal", "animalType"]}
        label={t("animalType")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Select
          placeholder={t("caretakerSearch.animalTypes")}
          options={[
            { value: "DOG", label: t("dog") },
            { value: "CAT", label: t("cat") },
            { value: "BIRD", label: t("bird") },
            { value: "REPTILE", label: t("reptile") },
            { value: "HORSE", label: t("horse") }
          ]}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        {offer ? t("editOffer") : t("addOffer")}
      </Button>
    </Form>
  );
};

export default OfferForm;
