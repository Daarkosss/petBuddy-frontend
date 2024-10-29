import { KeyboardEvent, useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CareReservation } from "../types/care.types";
import DatePicker, { Value } from "react-multi-date-picker";

const CareReservationForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [form] = Form.useForm<CareReservation>();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Value[]>([]);
  
  const handleFinish = async () => {
    form.validateFields();
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

  const handlePriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    const regex = /^\d/;

    const allowedKeys = ["Backspace", "Delete", ","];
    if (!regex.test(value) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="care-reservation-container">
      <Form 
        form={form} 
        onFinish={handleFinish}
        className="form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name={"animalType"}
          label={t("animalType")}
          rules={[{ required: true, message: t("validation.required") }]}
          initialValue={location.state?.animalType}
        >
          <Input disabled value={location.state?.animalType}/>
        </Form.Item>
        <Form.Item
          name={"date"}
          label={t("date")}
          rules={[{ required: true, message: t("validation.required") }]}
          initialValue={location.state?.animalType}
        >
          <DatePicker
            format="YYYY-MM-DD"
            range
            value={dateRange}
            onChange={setDateRange}
            render={(value, openCalendar) => (
              <Input
                value={value}
                onFocus={openCalendar}
                placeholder={t("placeholder.date")}
                style={{ width: 200 }}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("description")}
          rules={[{ required: true, message: t("validation.required") }]}
        >
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
        </Form.Item>
        <Form.Item
          name="dailyPrice"
          label={t("dailyPrice")}
          rules={[
            { required: true, message: t("validation.required") },
            { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: t("validation.price") }
          ]}
        >
          <Input 
            type="number"
            min={0}
            placeholder={t("dailyPrice")}
            onKeyDown={handlePriceKeyDown}
          />
        </Form.Item>
        <Button type="primary" className="submit-button centered" htmlType="submit" loading={isLoading}>
          {t("makeReservation")}
        </Button>
      </Form>
    </div>
  );
};

export default CareReservationForm;
