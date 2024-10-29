import { useState } from "react";
import { Form, Input, Button, Space } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CareReservation } from "../types/care.types";
import DatePicker from "react-multi-date-picker";

const CareReservationForm = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<CareReservation>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      toast.success(t("success.addOffer"));
    } catch (error) {
      toast.error(t("error.addOffer"));
    } finally {
      setIsLoading(false);
      form.resetFields();
    }
  };

  return (
    <div className="care-reservation-container">
      <Form form={form} onFinish={handleFinish}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Form.Item
            name={"animalType"}
            label={t("animalType")}
            rules={[{ required: true, message: t("validation.required") }]}
            initialValue={location.state?.animalType}
          >
            {location.state?.animalType}
          </Form.Item>
          <Form.Item
            name={"careStart"}
            label={t("careStart")}
            rules={[{ required: true, message: t("validation.required") }]}
            initialValue={location.state?.animalType}
          >
            <DatePicker
              format="YYYY-MM-DD"
              value={form.getFieldValue("careStart")}
            />
          </Form.Item>
          <Form.Item
            name={"careEnd"}
            label={t("careEnd")}
            rules={[{ required: true, message: t("validation.required") }]}
            initialValue={location.state?.animalType}
          >
            <DatePicker
              format="YYYY-MM-DD"
              value={form.getFieldValue("careEnd")}
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
            name="dailyPrice"
            label={t("dailyPrice")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t("makeReservation")}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default CareReservationForm;
