import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { OfferDTO, OfferDTOWithId } from "../../types";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface OfferFormProps {
  offer?: OfferDTOWithId;
  onSuccess: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFinish = async (values: OfferDTO) => {
    setIsLoading(true);
    try {
      await api.addOrEditOffer(values);
      toast.success(t("success.addOffer"));
      onSuccess();
    } catch (error) {
      toast.error(t("error.addOffer"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
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
      <Form.Item
        name="animalAmenities"
        label={t("amenities")}
      >
        <Select 
          mode="multiple"
          options={[
            { value: "toys", label: t("amenityTypes.toys") },
            { value: "scratching post", label: t("amenityTypes.scratchingPost") },
            { value: "cage", label: t("amenityTypes.cage") },
          ]}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        {t("addOffer")}
      </Button>
    </Form>
  );
};

export default OfferForm;
