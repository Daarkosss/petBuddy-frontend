import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Steps, Descriptions, Row, Col, Spin, Tooltip } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { AccountDataDTO, AnimalAttributes, AvailabilityValues } from "../types";
import RestrictedDatePicker from "../components/Calendar/RestrictedDatePicker";
import { calculateNumberOfDays, formatPrice } from "../models/Care";
import UserInfoPill from "../components/UserInfoPill";
import StatisticCard from "../components/StatisticCard";
import NumericFormItem from "../components/NumericFormItem";

const CareReservationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caretakerEmail } = useParams();
  const location = useLocation();
  const [form] = Form.useForm();
  const [isStarting, setIsStarting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [careDateRange, setCareDateRange] = useState<string[]>([]);
  const [availabilityRange, setAvailabilityRange] = useState<string[] | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [possibleAttributes, setPossibleAttributes] = useState<AnimalAttributes>({});
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
  const currentPrice = Form.useWatch("dailyPrice", form);
  const [caretakerInfo, setCaretakerInfo] = useState<AccountDataDTO>();

  const animalType: string = location.state?.animalType;
  const availabilities: AvailabilityValues = location.state?.availabilities.sort(
    (a: string[], b: string[]) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  useEffect(() => {
    const fetchCaretakerDetails = async () => {
      try {
        const caretakerInfo = await api.getCaretakerDetails(caretakerEmail!);
        setCaretakerInfo(caretakerInfo.accountData);
  
        if (!location.state) {
          navigate(`/profile-caretaker/${caretakerEmail}`);
          return;
        }
  
        setPossibleAttributes(location.state.animalAttributes);
        form.setFieldsValue({
          dailyPrice: location.state.dailyPrice,
        });
      } catch (error) {
        navigate("/caretaker/search");
      } finally {
        setIsStarting(false);
      }
    };
    fetchCaretakerDetails();
  
    const handleResize = () => {
      setWindowInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  
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

  const next = async () => {
    const isFormValid = await form.validateFields();
    if (isFormValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  if (isStarting) {
    return <Spin fullscreen />
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
              <NumericFormItem name="dailyPrice" label={t("dailyPrice")} disabled={!isNegotiating} />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Descriptions>
                <Descriptions.Item label={t("totalPrice")}>
                  {formatPrice(calculateTotalPrice(currentPrice))}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} sm={4} md={8} lg={4} xl={4}>
              {isNegotiating && (
                <StatisticCard
                  titlePositive={t("youWillSave")}
                  titleNegative={t("youWillLose")}
                  value={calculatePriceDifference()}
                  isPositive={isNewPriceLower()}
                />
              )}
            </Col>
          </Row>
          <Row>
            {isNegotiating ? (
              <Button type="primary" className="add-button" onClick={stopNegotiation}>
                {t("care.goBackToOriginalPrice")}
              </Button>
            ) : (
              <Tooltip title={careDateRange.length === 0 && t("careReservation.chooseDateFirst")}>
                <Button 
                  type="primary"
                  className={careDateRange.length > 0 ? "add-button" : ""}
                  onClick={() => setIsNegotiating(true)}
                  disabled={careDateRange.length === 0}
                >
                  {t("care.negotiatePrice")}
                </Button>
              </Tooltip>
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
            {formatPrice(calculateTotalPrice(form.getFieldValue("dailyPrice")))}
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

  return (
    <div>
      <div className="care-reservation-title">
        <div className="caretaker-info">
          <h2>{t("careReservation.title")}</h2>
          <h2>
            {caretakerInfo && <UserInfoPill user={caretakerInfo!} isLink={true} showAvatar={false} />}
          </h2>
        </div>
        <h3>
          {t("careReservation.forAnimal", { animalType: t(animalType.toLowerCase())})}
        </h3>
      </div>
      <div className="care-reservation-container">
        <img src={`/images/animals/${animalType.toLowerCase()}.jpg`} alt="animal" />
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
