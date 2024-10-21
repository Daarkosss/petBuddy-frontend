import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { OfferDTO } from "../../types";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface OfferFormProps {
  currentAnimalTypes: string[];
  onSuccess: () => void;
}

const AddOfferForm: React.FC<OfferFormProps> = ({ currentAnimalTypes, onSuccess }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const allAnimalTypes = ["DOG", "CAT", "BIRD", "REPTILE"];
  const availableAnimalTypes = allAnimalTypes.filter((type) => !currentAnimalTypes.includes(type));
  
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
      form.resetFields();
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item
        name={["animal", "animalType"]}
        label={t("animalType")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Select
          placeholder={t("caretakerSearch.animalTypes")}
          options={availableAnimalTypes.map(
            (type) => ({ value: type, label: t(type.toLowerCase()) })
          )}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label={t("description")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="animalAmenities"
        label={t("amenities")}
      >
        <Select 
          mode="multiple"
          options={[
            { value: "toys", label: t("amenityTypes.toys") },
            { value: "scratching post", label: t("amenityTypes.scratching post") },
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

export default AddOfferForm;
