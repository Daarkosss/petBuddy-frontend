import { useState, useEffect } from "react";
import { Button, Spin, Timeline, Card, Descriptions, Modal, Form, Space, Popconfirm, Alert } from "antd";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import store from "../store/RootStore";
import { Care } from "../models/Care";
import UserInfoPill from "../components/UserInfoPill";
import StatisticCard from "../components/StatisticCard";
import NumericFormItem from "../components/NumericFormItem";
import { formatPrice } from "../models/Care";
import StatisticCountdown from "../components/StatisticCountdown";

const CareDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { careId } = useParams();
  const [care, setCare] = useState<Care>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const newPrice = Form.useWatch("newPrice", form);

  const careIdNumber = careId ? parseInt(careId) : undefined;

  const setNotificationsAsRead = async () => {
    if (careIdNumber) {
      store.notification.markCareNotificationsAsRead(careIdNumber);
    }
  };

  useEffect(() => {
    const fetchCareDetails = async () => {
      try {
        const data = await api.getCare(careIdNumber!);
        if (data) {
          setCare(new Care(data));
          store.notification.openCareId = careIdNumber!;
        }
      } catch (error) {
        navigate("/cares");
        toast.error(t("error.getCare"));
      }
    };
    fetchCareDetails();
    setNotificationsAsRead();

    store.selectedMenuOption = "cares";

    return () => {
      store.notification.openCareId = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careId]);

  const acceptCare = async () => {
    setIsLoading(true);
    try {
      const data = await api.acceptCare(careIdNumber!);
      if (data) {
        setCare(new Care(data));
      }
      toast.success(t("success.acceptCare"));
    } catch (error) {
      toast.error(t("error.acceptCare"));
    } finally {
      setIsLoading(false);
    }
  };

  const rejectCare = async () => {
    setIsLoading(true);
    try {
      const data = await api.rejectCare(careIdNumber!);
      if (data) {
        setCare(new Care(data));
      }
      toast.success(t("success.rejectCare"));
    } catch (error) {
      toast.error(t("error.rejectCare"));
    } finally {
      setIsLoading(false);
    }
  };

  const proposeNewPrice = async () => {
    setIsLoading(true);
    try {
      await form.validateFields();
      const newPrice = form.getFieldValue("newPrice");
      const data = await api.updateCarePrice(careIdNumber!, newPrice);
      if (data) {
        setCare(new Care(data));
      }
      setIsModalOpen(false);
      toast.success(t("success.updatePrice"));
    } catch (error) {
      toast.error(t("error.updatePrice"));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBeginOfCare = async () => {
    setIsLoading(true);
    try {
      const data = await api.confirmBeginOfCare(careIdNumber!);
      if (data) {
        setCare(new Care(data));
      }
      toast.success(t("success.confirmBeginOfCare"));
    } catch (error) {
      toast.error(t("error.confirmBeginOfCare"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimeline = () => (
    <Timeline 
      className="timeline"
      mode="left"
      items={care!.timelineItems}>
    </Timeline>
  );

  const calculateTotalPrice = (price: number) => {
    return price * care!.numberOfDays;
  };

  const calculatePriceDifference = () => {
    return Math.abs(calculateTotalPrice(newPrice) - calculateTotalPrice(care!.dailyPrice));
  };

  const isNewPriceHigher = () => {
    return calculateTotalPrice(newPrice) >= calculateTotalPrice(care!.dailyPrice);
  };

  const isSamePrice = () => {
    return parseFloat(newPrice || "0") === care?.dailyPrice;
  };

  if (!care) {
    return <Spin fullscreen />;
  }

  return (
    <div className="care-details-container">
      <Card>
        <div className="care-details-card">
          <Descriptions
            title={
              <div className="pretty-wrapper">
                {t("care.fromTo", { from: care.careStart, to: care.careEnd, days: care.numberOfDays })}
              </div>
            }
            bordered
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          >
            <Descriptions.Item label={t("animalType")}>
              {t(`animalTypes.${care.animalType}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t("animalAttributes")}>
              <div>
                {Object.entries(care.selectedOptions).map(([key, value]) => (
                  <div key={key}>
                    {t(`${key}.title`)}: {value.map((option) => t(`${key}.${option}`)).join(", ")}
                  </div>
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t("dailyPrice")}>
              {care.formattedDailyPrice}
            </Descriptions.Item>
            <Descriptions.Item label={t("totalPrice")}>
              {care.totalPrice}
            </Descriptions.Item>
            <Descriptions.Item label={t("caretaker")}>
              <UserInfoPill user={care.caretaker} isLink={true} />
            </Descriptions.Item>
            <Descriptions.Item label={t("client")}>
              <UserInfoPill user={care.client} isLink={false} />
            </Descriptions.Item>
            <Descriptions.Item label={t("description")}>
              {care.description}
            </Descriptions.Item>
          </Descriptions>
          {renderTimeline()}
          {care.currentUserStatus === "PENDING" && 
            <div className="actions">
              <Popconfirm
                title={t("care.accept")}
                description={t("care.confirmAccept")}
                onConfirm={acceptCare}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Button type="primary" loading={isLoading}>
                  {t("care.accept")}
                </Button>
              </Popconfirm>
              {store.user.profile?.selected_profile === "CARETAKER" &&
                <Button type="primary" className="add-button" onClick={() => setIsModalOpen(true)}>
                  {t("care.proposeNewPrice")}
                </Button>}
              <Popconfirm
                title={t("care.reject")}
                description={t("care.confirmReject")}
                onConfirm={rejectCare}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Button type="primary" danger loading={isLoading}>
                  {t("care.reject")}
                </Button>
              </Popconfirm>
            </div>
          }
          {care.isAbleToConfirmBeginOfCare && 
            <>
              <div className="actions-with-countdown">
                <StatisticCountdown />
                <Popconfirm
                  title={t("care.beginOfCare")}
                  description={t("care.confirmBeginOfCare")}
                  onConfirm={confirmBeginOfCare}
                  okText={t("yes")}
                  cancelText={t("no")}
                >
                  <Button type="primary" loading={isLoading}>
                    {t("care.beginOfCare")}
                  </Button>
                </Popconfirm>
              </div>
              <Alert message={t("care.ifCaretakerDoesntConfirm")} type="warning" showIcon />
            </>
          }
          {care.currentUserStatus === "READY_TO_PROCEED" && care.isStartTomorrow &&
            <Alert
              message={t("care.careStartsTomorrow")}
              description={store.user.profile?.selected_profile === "CARETAKER" 
                ? t("care.rememberToConfirmBeginOfCare")
                : t("care.caretakerShouldConfirmBeginOfCare")
              }
              type="info"
              showIcon
            />
          }
        </div>
      </Card>
      <img src={`/images/animals/${care.animalType.toLowerCase()}.jpg`}/>
      <Modal
        title={t("care.proposeNewPrice")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={proposeNewPrice}
        okText={t("care.confirmNewPrice")}
        okButtonProps={{ loading: isLoading, disabled: isSamePrice() }}
        cancelText={t("cancel")}
        width={400}
      >
        <Form layout="vertical" form={form} onFinish={proposeNewPrice}>
          <Space direction="vertical" size={10}>
            <NumericFormItem
              name="newPrice"
              label={t("care.newDailyPrice")} 
              initialValue={care.dailyPrice}
            />
            {!isSamePrice() &&
              <div className="price-difference">
                <Descriptions>
                  <Descriptions.Item label={t("newTotalPrice")}>
                    {formatPrice(newPrice * care.numberOfDays)}
                  </Descriptions.Item>
                </Descriptions>
                <StatisticCard
                  titlePositive={t("youWillGain")}
                  titleNegative={t("youWillLose")}
                  value={calculatePriceDifference()}
                  isPositive={isNewPriceHigher()}
                />
              </div>
            }
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default CareDetails;
