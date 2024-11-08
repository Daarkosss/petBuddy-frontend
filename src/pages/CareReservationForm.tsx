import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select, Steps, Descriptions } from "antd";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [careDateRange, setCareDateRange] = useState<string[]>([]);
  const [availabilityRange, setAvailabilityRange] = useState<string[] | null>(null);
  const [isNegotiate, setIsNegotiate] = useState(false);
  const [animalAttributes, setAnimalAttributes] = useState<AnimalAttributes>();
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

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

    const handleResize = () => {
      setWindowInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async () => {
    form.validateFields();
    setIsLoading(true);
    try {
      const formValues = form.getFieldsValue(true);
      formValues.animalType = animalType;
      formValues.dateRange = careDateRange;
      await api.makeCareReservation(caretakerEmail!, formValues);
      navigate(-1);
      toast.success(t("success.askForCare"));
      form.resetFields();
    } catch (error) {
      toast.error(t("error.askForCare"));
    } finally {
      setIsLoading(false);
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

  const onStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const steps = [
    {
      title: t("careReservation.step1Title"),
      description: t("careReservation.step1Description"),
      content: (
        <>
          {Object.keys(animalAttributes || {}).map((attributeKey) => (
            <Form.Item
              key={attributeKey}
              name={["selectedOptions", attributeKey]}
              label={t(attributeKey.toLowerCase())}
              rules={[{ required: true, message: t("validation.required") }]}
              style={{ maxWidth: 300 }}
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
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: t("careReservation.step2Title"),
      description: t("careReservation.step2Description"),
      content: (
        <>
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
            style={{ maxWidth: 185 }}
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
          {isNegotiate ? (
            <Button type="primary" className="add-button" onClick={stopNegotiation}>
              {t("care.goBackToOriginalPrice")}
            </Button>
          ) : (
            <Button type="primary" className="add-button" onClick={() => setIsNegotiate(true)}>
              {t("care.negotiatePrice")}
            </Button>
          )}
        </>
      ),
    },
    {
      title: t("careReservation.step3Title"),
      description: t("careReservation.step3Description"),
      content: (
        <Descriptions bordered column={1} size="middle" layout={windowInnerWidth < 768 ? "vertical" : "horizontal"}>
          <Descriptions.Item label={t("animalType")}>{t(animalType.toLowerCase())}</Descriptions.Item>
          <Descriptions.Item label={t("care.date")}>
            {careDateRange.join(" ~ ")}
          </Descriptions.Item>
          <Descriptions.Item label={t("dailyPrice")}>
            {form.getFieldValue("dailyPrice")} zł za dzień
          </Descriptions.Item>
          {Object.keys(animalAttributes || {}).map((key) => (
            <Descriptions.Item key={key} label={t(key.toLowerCase())}>
              {form.getFieldValue(["selectedOptions", key])}
            </Descriptions.Item>
          ))}
          <Descriptions.Item label={t("petDescription")}>
            <Input.TextArea
              value={form.getFieldValue("description")}
              autoSize={{ minRows: 2, maxRows: 4 }}
              disabled
            />
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      toast.error(t("error.fillRequiredFields"));
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="care-reservation-container">
      <img src={`/images/${animalType.toLowerCase()}-card.jpg`} alt="Logo" />
      <div className="form-container">
        <Steps 
          current={currentStep}
          onChange={onStepClick} 
          direction={windowInnerWidth < 768 ? "vertical" : "horizontal"}
          style={{ marginLeft: windowInnerWidth < 768 ? 20 : 0 }}
        >
          {steps.map((item) => (
            <Steps.Step
              key={item.title}
              title={item.title} 
              description={item.description} 
              disabled={currentStep < steps.indexOf(item)}
            />
          ))}
        </Steps>
        <Form form={form} onFinish={handleFinish} layout="vertical" className="form">
          <div className="steps-content">{steps[currentStep].content}</div>
          <div className="steps-action">
            {currentStep > 0 && (
              <Button onClick={() => prev()}>
                {t("previous")}
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {t("next")}
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("care.askForCare")}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
