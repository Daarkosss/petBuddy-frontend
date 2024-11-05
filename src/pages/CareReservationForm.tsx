import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CareReservation } from "../types/care.types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import store from "../store/RootStore";
import { api } from "../api/api";
import { AvailabilityValues } from "../types";

const CareReservationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const location = useLocation();
  const [form] = Form.useForm<CareReservation>();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [endDateOptions, setEndDateOptions] = useState<string[]>([]);

  const animalType: string = location.state?.animalType || "DOG"
  const availabilities: AvailabilityValues = location.state?.availabilities;

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
      formValues.dateRange = [startDate!, endDate!];
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

  const handleStartDateChange = (date: DateObject) => {
    const convertedDate = date.format("YYYY-MM-DD");

    setStartDate(convertedDate);
    // Znajdź zakres, w którym znajduje się data początkowa
    const selectedRange = availabilities.find((range) =>
      isDateInRange(date.format("YYYY-MM-DD"), range)
    );
    // Ustaw dostępne daty końcowe na podstawie wybranego zakresu
    if (selectedRange && selectedRange !== endDateOptions) {
      setEndDateOptions(selectedRange);
      setEndDate(null);
    }
    if (endDate && new Date(endDate) < new Date(convertedDate)) {
      setEndDate(convertedDate);
      console.log(convertedDate);
    }
  };

  const handleEndDateChange = (date: DateObject) => {
    setEndDate(date.format("YYYY-MM-DD"));
  };

  const isDateInRange = (date: string, range: string[]) => {
    const start = new Date(range[0]);
    const end = new Date(range[1]);
    const currentDate = new Date(date);

    return currentDate >= start && currentDate <= end;
  };

  return (
    <div className="care-reservation-container">
      <img src={`/images/${animalType.toLowerCase()}-card.jpg`} alt="Logo"/>
      <div className="form-container">
        <div>
          <h1>{t("care.title")}</h1>
          <h2>{t(animalType.toLowerCase())}</h2>
        </div>
        <Form 
          form={form} 
          onFinish={handleFinish}
          className="form"
          labelCol={{ span: 7 }}
        >
          <Form.Item
            label={t("care.startDate")}
            name="startDate"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              value={startDate}
              onChange={handleStartDateChange}
              mapDays={({ date }) => {
                const formattedDate = date.format("YYYY-MM-DD");
                return {
                  disabled: !availabilities.some(range => isDateInRange(formattedDate, range))
                };
              }}
            />
          </Form.Item>
          <Form.Item
            label={t("care.endDate")}
            name="endDate"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <DatePicker
              key={startDate || endDateOptions[0]}
              format="YYYY-MM-DD"
              value={endDate}
              onChange={handleEndDateChange}
              currentDate={startDate ? new DateObject(startDate) : undefined}
              minDate={startDate || endDateOptions[0]}
              maxDate={endDateOptions[1]}
              disabled={!startDate}
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
            label={t("petDescription")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input.TextArea
              placeholder={t("placeholder.animalDescription")}
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </Form.Item>
          <Button type="primary" className="submit-button centered" htmlType="submit" loading={isLoading}>
            {t("care.askForCare")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
