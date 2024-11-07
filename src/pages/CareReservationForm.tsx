import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { AnimalAttributes, AvailabilityValues } from "../types";
import RestrictedDatePicker from "../components/Calendar/RestrictedDatePicker";

const CareReservationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const location = useLocation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [careDateRange, setCareDateRange] = useState<string[]>([]);
  const [availabilityRange, setAvailabilityRange] = useState<string[] | null>(null);
  const [isNegotiate, setIsNegotiate] = useState(false);
  const [animalAttributes, setAnimalAttributes] = useState<AnimalAttributes>();

  const animalType: string = location.state?.animalType;
  const availabilities: AvailabilityValues = location.state?.availabilities.sort(
    (a: string[], b: string[]) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  useEffect(() => {
    if (!location.state) {
      navigate(-1);
    }

    setAnimalAttributes(location.state?.animalAttributes);
    form.setFieldsValue({
      dailyPrice: location.state?.dailyPrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async () => {
    form.validateFields();
    setIsLoading(true);
    try {
      const formValues = form.getFieldsValue();
      formValues.animalType = animalType;
      formValues.dateRange = careDateRange;
      await api.makeCareReservation(caretakerEmail!, formValues);
      navigate(-1);
      toast.success(t("success.askForCare"));
    } catch (error) {
      toast.error(t("error.askForCare"));
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

  const updateCareDateRange = (dateRange: string[]) => {
    setCareDateRange(dateRange);
    form.setFieldValue("careDateRange", dateRange);
  };

  const stopNegotiation = () => {
    setIsNegotiate(false);
    form.setFieldsValue({ dailyPrice: location.state?.dailyPrice });
  };

  return (
    <div className="care-reservation-container">
      <img src={`/images/${animalType.toLowerCase()}-card.jpg`} alt="Logo" />
      <div className="form-container">
        <div>
          <h1>{t("care.reservation")}</h1>
          <h2>{t(animalType.toLowerCase())}</h2>
        </div>
        <Form
          form={form}
          onFinish={handleFinish}
          className="form"
          labelCol={{ span: 7 }}
        >
          <Form.Item
            name="careDateRange"
            label={t("care.date")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <RestrictedDatePicker
              dateValue={careDateRange}
              handleChange={updateCareDateRange}
              availabilities={availabilities}
              availabilityRange={availabilityRange}
              setAvailabilityRange={setAvailabilityRange}
            />
          </Form.Item>
          <Form.Item
            name="dailyPrice"
            label={t("dailyPrice")}
            rules={[
              { required: true, message: t("validation.required") },
              { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: t("validation.price") },
            ]}
          >
            <Input
              className="price-input"
              type="number"
              min={0.01}
              max={99999.99}
              step={0.01}
              placeholder={t("placeholder.dailyPrice")}
              onKeyDown={handlePriceKeyDown}
              disabled={!isNegotiate}
            />
          </Form.Item>
          {Object.keys(animalAttributes || {}).map((attributeKey) => (
            <Form.Item
              key={attributeKey}
              name={["selectedOptions", attributeKey]}
              label={t(attributeKey.toLowerCase())}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                placeholder={t("placeholder.selectFromList")}
                options={animalAttributes![attributeKey].map((value) => ({
                  value,
                  label: t(value.toLowerCase()),
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
          {isNegotiate ?
            <Button
              type="primary"
              className="add-button"
              onClick={stopNegotiation}
            >
              {t("care.goBackToOriginalPrice")}
            </Button> :
            <Button
              type="primary"
              className="add-button"
              onClick={() => setIsNegotiate(true)}
            >
              {t("care.negotiatePrice")}
            </Button>
          }
          <Button
            type="primary"
            className="submit-button centered"
            htmlType="submit"
            loading={isLoading}
          >
            {t("care.askForCare")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
