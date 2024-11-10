import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Steps, Descriptions, Statistic, Card, Row, Col } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { api } from "../api/api";
import { AnimalAttributes, AvailabilityValues } from "../types";
import RestrictedDatePicker from "../components/Calendar/RestrictedDatePicker";
import { calculateNumberOfDays } from "../models/Care";

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
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [possibleAttributes, setPossibleAttributes] = useState<AnimalAttributes>({});
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

    setPossibleAttributes(location.state?.animalAttributes);
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
    setIsLoading(true);
    try {
      const formValues = form.getFieldsValue(true);
      formValues.animalType = animalType;
      formValues.dateRange = careDateRange;
      const newCare = await api.makeCareReservation(caretakerEmail!, formValues);
      if (newCare) {
        navigate(`/care/${newCare.id}`);
        toast.success(t("success.askForCare"));
        form.resetFields();
      }
    } catch (error) {
      toast.error(t("error.askForCare"));
    } finally {
      setIsLoading(false);
    }
  };

  const updateCareDateRange = (dateRange: string[]) => {
    setCareDateRange(dateRange);
    form.setFieldValue("careDateRange", dateRange);
  };

  const stopNegotiation = () => {
    setIsNegotiating(false);
    form.setFieldsValue({ dailyPrice: location.state?.dailyPrice });
  };

  const onStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const calculateNumberOfDaysOfCare = () => {
    const [dateFrom, dateTo] = careDateRange;
    if (!dateFrom) {
      return 0;
    } else if (!dateTo) {
      return 1;
    }
    return calculateNumberOfDays(dateFrom, dateTo);
  };

  const calculateTotalPrice = (price: number) => {
    return price * calculateNumberOfDaysOfCare();
  };

  const calculatePriceDifference = () => {
    return Math.abs(calculateTotalPrice(location.state?.dailyPrice) - calculateTotalPrice(currentPrice));
  }

  const isNewPriceLower = () => {
    return calculateTotalPrice(location.state?.dailyPrice) >= calculateTotalPrice(currentPrice);
  }

  const steps = [
    {
      title: t("careReservation.step1Title"),
      description: t("careReservation.step1Description"),
      content: (
        <>
          {Object.keys(possibleAttributes).map((attributeKey) => (
            <Form.Item
              key={attributeKey}
              name={["selectedOptions", attributeKey]}
              label={t(attributeKey.toLowerCase())}
              rules={[{ required: true, message: t("validation.required") }]}
              style={{ maxWidth: 200 }}
            >
              <Select
                placeholder={t("placeholder.selectFromList")}
                options={possibleAttributes[attributeKey].map((value) => ({
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
              autoSize={{ minRows: 4, maxRows: 4 }}
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
                <Descriptions.Item label={t("care.numberOfDays")}>{calculateNumberOfDaysOfCare()}</Descriptions.Item>
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
                  disabled={!isNegotiating}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Descriptions>
                <Descriptions.Item label={t("totalPrice")}>{calculateTotalPrice(currentPrice)}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} sm={4} md={8} lg={4} xl={4}>
              {isNegotiating && (
                <Card style={{ width: "max-content" }} size="small">
                  <Statistic
                    title={isNewPriceLower() ? t("youWillSave") : t("youWillLose")}
                    value={calculatePriceDifference()}
                    precision={2}
                    decimalSeparator=","
                    groupSeparator="."
                    valueStyle={{ color: isNewPriceLower() ? "green" : "red" }}
                    prefix={isNewPriceLower() ? <ArrowUpOutlined/> : <ArrowDownOutlined/>}
                    suffix="zł"
                  />
                </Card>
              )}
            </Col>
          </Row>
          <Row>
            {isNegotiating ? (
              <Button type="primary" className="add-button" onClick={stopNegotiation}>
                {t("care.goBackToOriginalPrice")}
              </Button>
            ) : (
              <Button type="primary" className="add-button" onClick={() => setIsNegotiating(true)}>
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
            {careDateRange.join(" ~ ")} <b>({calculateNumberOfDaysOfCare()} dni)</b>
          </Descriptions.Item>
          <Descriptions.Item label={t("totalPrice")}>
            {calculateTotalPrice(form.getFieldValue("dailyPrice"))} zł
          </Descriptions.Item>
          {Object.keys(possibleAttributes).map((key) => (
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
    <div>
      <div className="care-reservation-title">
        <h1>{t("careReservation.title")}</h1>
        <h2>{t(animalType.toLowerCase())}</h2>
      </div>
      <div className="care-reservation-container">
        <img src={`/images/${animalType.toLowerCase()}-card.jpg`} alt="animal" />
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
    </div>
  );
};

export default CareReservationForm;
