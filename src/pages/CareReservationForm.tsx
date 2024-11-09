import { KeyboardEvent, useEffect, useState } from "react";
import { Form, Input, Button, Select, Steps, Descriptions, Statistic, Card, Row, Col } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { AnimalAttributes, AvailabilityValues } from "../types";
import RestrictedDatePicker from "../components/Calendar/RestrictedDatePicker";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

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
  const currentPrice = Form.useWatch("dailyPrice", form);

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

  const countDays = () => {
    const [dateFrom, dateTo] = careDateRange;
    if (!dateFrom) {
      return 0;
    } else if (!dateTo) {
      return 1;
    }
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to.getTime() - from.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };
  const calculateTotalPrice = (price: number) => {
    return (price * countDays());
  };

  const calculatePriceDifference = () => {
    return calculateTotalPrice(location.state?.dailyPrice) - calculateTotalPrice(currentPrice);
  }

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
              style={{ maxWidth: 200 }}
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
              autoSize={{ minRows: 4, maxRows: 5 }}
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
          <Row align="middle">
            <Col xs={24} sm={12} md={10} lg={10} xl={8}>
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
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Descriptions>
                <Descriptions.Item label={t("care.numberOfDays")}>{countDays()}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Row align="middle">
            <Col xs={24} sm={12} md={10} lg={10} xl={8}>
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
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Descriptions>
                <Descriptions.Item label={t("totalPrice")}>{calculateTotalPrice(currentPrice)}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} sm={4} md={8} lg={4} xl={4}>
              {isNegotiate && (
                <Card style={{ width: "max-content" }} size="small">
                  <Statistic
                    title={t("youWillSave")}
                    value={location.state?.dailyPrice - currentPrice}
                    precision={2}
                    decimalSeparator=","
                    groupSeparator=""
                    valueStyle={{ color: calculatePriceDifference() < 0 ? "red" : "green" }}
                    prefix={calculatePriceDifference() < 0 ? <ArrowDownOutlined/> : <ArrowUpOutlined />}
                    suffix="zł"
                  />
                </Card>
              )}
            </Col>
          </Row>
          <Row>
            {isNegotiate ? (
              <Button type="primary" className="add-button" onClick={stopNegotiation}>
                {t("care.goBackToOriginalPrice")}
              </Button>
            ) : (
              <Button type="primary" className="add-button" onClick={() => setIsNegotiate(true)}>
                {t("care.negotiatePrice")}
              </Button>
            )}
          </Row>
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
            {careDateRange.join(" ~ ")} <b>({countDays().toString()} dni)</b>
          </Descriptions.Item>
          <Descriptions.Item label={t("totalPrice")}>
            {calculateTotalPrice(form.getFieldValue("dailyPrice"))} zł
          </Descriptions.Item>
          {Object.keys(animalAttributes || {}).map((key) => (
            <Descriptions.Item key={key} label={t(key.toLowerCase())}>
              {form.getFieldValue(["selectedOptions", key]) && 
                t(form.getFieldValue(["selectedOptions", key]).toLowerCase())
              }
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
    const isFormValid = await form.validateFields();
    if (isFormValid) {
      setCurrentStep(currentStep + 1);
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
                {t("careReservation.confirm")}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CareReservationForm;
