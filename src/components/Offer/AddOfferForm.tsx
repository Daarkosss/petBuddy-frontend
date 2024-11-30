import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { OfferDTO } from "../../types";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import store from "../../store/RootStore";

interface OfferFormProps {
  currentAnimalTypes: string[];
  onSuccess: () => void;
}

const AddOfferForm: React.FC<OfferFormProps> = ({ currentAnimalTypes, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const animalType = Form.useWatch(["animal", "animalType"], form);

  const availableAnimalTypes = store.animal.allAnimalTypes.filter((type) => !currentAnimalTypes.includes(type));
  
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

  useEffect(() => {
    form.setFieldValue(["animalAmenities"], []);
  }, [form, animalType]);

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item
        name={["animal", "animalType"]}
        label={t("animalType")}
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Select
          placeholder={t("animalTypes.title")}
          options={availableAnimalTypes.map(
            (type) => ({ value: type, label: t(`animalTypes.${type}`) })
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
          showSearch={false}
          notFoundContent={t("noData")}
          options={store.animal.getAmenities(animalType).map((amenity) => ({
            value: amenity,
            label: t(`amenityTypes.${amenity}`)
          }))}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        {t("addOffer")}
      </Button>
    </Form>
  );
};

export default AddOfferForm;
