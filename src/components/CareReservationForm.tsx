import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
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

  useEffect(() => {
    form.setFieldsValue({
      animalType: location.state?.animalType,
      dailyPrice: location.state?.dailyPrice,
      animalAttributes: location.state?.animalAttributes
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  
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
      <img src="/images/cat-card.jpg" alt="Logo"/>
      <div className="form-container">
        <h1>{t("careReservationTitle")}</h1>
        <Form 
          form={form} 
          onFinish={handleFinish}
          className="form"
          labelCol={{ span: 7 }}
        >
          <Form.Item
            name={"animalType"}
            label={t("animalType")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input disabled />
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
          <Form.Item
            name={["animalAttributes", "SEX"]}
            label={t("sex")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Select
              mode="multiple"
              showSearch={false}
              options={[
                { value: "MALE", label: t("male") },
                { value: "SHE", label: t("she") },
              ]}
            />
          </Form.Item>
          <Form.Item
            name={["animalAttributes", "SIZE"]}
            label={t("size")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Select
              mode="multiple"
              showSearch={false}
              options={[
                { value: "SMALL", label: t("small") },
                { value: "BIG", label: t("big") },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("description")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
          </Form.Item>
          <Button type="primary" className="submit-button centered" htmlType="submit" loading={isLoading}>
            {t("makeReservation")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
