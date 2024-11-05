import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CareReservation } from "../types/care.types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import store from "../store/RootStore";
import { api } from "../api/api";

const CareReservationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const location = useLocation();
  const [form] = Form.useForm<CareReservation>();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const animalType: string = location.state?.animalType || "DOG"

  useEffect(() => {
    if (!location.state) {
      navigate(-1);
    }
    form.setFieldsValue({
      dailyPrice: location.state?.dailyPrice,
      animalAttributes: location.state?.animalAttributes
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  
  const handleFinish = async () => {
    form.validateFields();
    setIsLoading(true);
    try {
      const formValues = form.getFieldsValue();
      formValues.animalType = animalType;
      formValues.dateRange = dateRange;
      await api.makeCareReservation(caretakerEmail!, formValues);
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

  const handleDateChange = (dateRange: DateObject[]) => {
    setDateRange(dateRange.map((date) => date.format("YYYY-MM-DD")));
  };

  return (
    <div className="care-reservation-container">
      <img src={`/images/${animalType.toLowerCase()}-card.jpg`} alt="Logo"/>
      <div className="form-container">
        <div>
          <h1>{t("careReservation.title")}</h1>
          <h2>{t(animalType.toLowerCase())}</h2>
        </div>
        <Form 
          form={form} 
          onFinish={handleFinish}
          className="form"
          labelCol={{ span: 7 }}
        >
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
              onChange={handleDateChange}
              minDate={location.state?.minDate || "2024-11-20"}
              maxDate={location.state?.maxDate || "2024-12-15"}
              render={(value, openCalendar) => (
                <Input
                  value={value}
                  onFocus={openCalendar}
                  placeholder={t("placeholder.date")}
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
              min={0.01}
              max={99999.99}
              step={0.01}
              placeholder={t("placeholder.dailyPrice")}
              onKeyDown={handlePriceKeyDown}
            />
          </Form.Item>
          {store.animal.getAnimalAttributeKeys(animalType).map((attributeKey) => (
            <Form.Item
              key={attributeKey}
              name={["animalAttributes", attributeKey]}
              label={t(attributeKey.toLowerCase())}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                showSearch={false}
                placeholder={t("placeholder.selectFromList")}
                options={store.animal.getAttributeValues(animalType, attributeKey).map((value) => ({
                  value,
                  label: t(value.toLowerCase())
                }))}
              />
            </Form.Item>
          ))}
          <Form.Item
            name="description"
            label={t("description")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input.TextArea
              placeholder={t("placeholder.animalDescription")}
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </Form.Item>
          <Button type="primary" className="submit-button centered" htmlType="submit" loading={isLoading}>
            {t("careReservation.askForCare")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
