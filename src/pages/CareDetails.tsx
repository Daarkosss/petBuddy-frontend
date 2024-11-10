import { useState, useEffect } from "react";
import { Button, Spin, Timeline, Card, Descriptions, Modal, Input, Form, Space, Popconfirm } from "antd";
import { CareDTO } from "../types/care.types";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import store from "../store/RootStore";

const CareDetails = () => {
  const { t } = useTranslation();
  const { careId } = useParams();
  const [care, setCare] = useState<CareDTO>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const careIdNumber = careId ? parseInt(careId) : undefined;

  const fetchCareDetails = async () => {
    try {
      const data = await api.getCare(careIdNumber!);
      if (data) {
        setCare(data);
      }
    } catch (error) {
      toast.error(t("error.getCaretakers"));
    }
  };

  useEffect(() => {
    fetchCareDetails();

    store.selectedMenuOption = "cares";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptCare= async () => {
    setIsLoading(true);
    try {
      const data = await api.acceptCare(careIdNumber!);
      if (data) {
        setCare(data);
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
        setCare(data);
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
        setCare(data);
      }
      console.log(data);
      setIsModalOpen(false);
      toast.success(t("success.updatePrice"));
    } catch (error) {
      toast.error(t("error.updatePrice"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTotalPrice = (dailyPrice: number, start: string, end: string) => {
    const days =
      (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) + 1; // + 1 to include the end date
    return (dailyPrice * days).toFixed(2);
  };

  const numberOfDays = (start: string, end: string) => {
    const days =
      (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) + 1; // + 1 to include the end date
    return days;
  };

  const careStatusFromYourSide = () => {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return care?.caretakerStatus;
    } else {
      return care?.clientStatus;
    }
  }

  const careStatusFromOtherSide = () => {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return care?.clientStatus;
    } else {
      return care?.caretakerStatus;
    }
  }

  const getDateTime = (value: string | undefined) => {
    if (!value) {
      return "";
    }
    const dateTime = new Date(value);
    return dateTime.toLocaleString();
  }

  const getTimelineItems = () => {
    const items = [];
  
    // Zawsze pierwszy item - zgłoszenie opieki.
    items.push({
      color: "green",
      children: t("careStatus.reported"),
      label: getDateTime(care?.submittedAt)
    });
  
    // Sprawdzenie, czy opieka została anulowana lub jest nieaktualna.
    if (careStatusFromYourSide() === "CANCELLED" || careStatusFromOtherSide() === "CANCELLED") {
      items.push({
        color: "red",
        children: t("careStatus.cancelled")
      });
    } else if (careStatusFromYourSide() === "OUTDATED" || careStatusFromOtherSide() === "OUTDATED") {
      items.push({
        color: "gray",
        children: t("careStatus.outdated")
      });
    } else {
      if (careStatusFromYourSide() === "PENDING") {
        items.push({
          color: "orange",
          children: t("careStatus.waitingForYourResponse")
        });
      } else if (careStatusFromOtherSide() === "PENDING") {
        items.push({
          color: "orange",
          children: t("careStatus.waitingForOtherResponse")
        });
      }

      if (careStatusFromYourSide() === "AWAITING_PAYMENT" || careStatusFromOtherSide() === "AWAITING_PAYMENT") {
        items.push({
          color: "green",
          children: t("careStatus.accepted")
        });
        items.push({
          color: "blue",
          children: t("careStatus.waitingToTakePlace")
        });
      }
      if (careStatusFromYourSide() === "DONE" || careStatusFromOtherSide() === "DONE") {
        items.push({
          color: "green",
          children: t("careStatus.done")
        });
      } 
      if (careStatusFromYourSide() === "ACCEPTED" && careStatusFromOtherSide() === "ACCEPTED") {
        if (care!.careStart > new Date().toISOString()) {
          items.push({
            color: "blue",
            children: t("careStatus.waitingToTakePlace")
          });
        } else if (care!.careEnd < new Date().toISOString()) {
          items.push({
            color: "blue",
            children: t("careStatus.isTakingPlace")
          });
        }
      }
    }
  
    return items;
  };

  const renderTimeline = () => (
    <Timeline 
      style={{ marginLeft: "-40px" }}
      mode="left"
      items={getTimelineItems()}>
    </Timeline>
  );

  if (!care) {
    return <Spin />;
  }

  return (
    <div className="care-details-container">
      <Card>
        <div className="care-details-card">
          <Descriptions
            title={t("care.fromTo", { 
              from: care.careStart,
              to: care.careEnd, 
              days: numberOfDays(care.careStart, care.careEnd) 
            })}
            bordered
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          >
            <Descriptions.Item label={t("animalType")}>
              {t(care.animalType.toLowerCase())}
            </Descriptions.Item>
            <Descriptions.Item label={t("animalAttributes")}>
              <div>
                {Object.entries(care.selectedOptions).map(([key, value]) => (
                  <div key={key}>
                    {t(key.toLowerCase())}: {value.map((option) => t(option.toLowerCase())).join(", ")}
                  </div>
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t("dailyPrice")}>
              {care.dailyPrice.toFixed(2)} zł
            </Descriptions.Item>
            <Descriptions.Item label={t("totalPrice")}>
              {formatTotalPrice(care.dailyPrice, care.careStart, care.careEnd)} zł
            </Descriptions.Item>
            <Descriptions.Item label={t("caretaker")}>
              {care.caretakerEmail}
            </Descriptions.Item>
            <Descriptions.Item label={t("client")}>
              {care.clientEmail}
            </Descriptions.Item>
            <Descriptions.Item label={t("description")}>
              {care.description}
            </Descriptions.Item>
          </Descriptions>
          {renderTimeline()}
          {careStatusFromYourSide() === "PENDING" && 
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
        </div>
      </Card>
      <img src={`/images/${care.animalType.toLowerCase()}-card.jpg`}/>
      <Modal
        title={t("care.proposeNewPrice")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={proposeNewPrice}
        okText={t("care.confirmNewPrice")}
        width={350}
      >
        <Form layout="vertical" form={form} onFinish={proposeNewPrice}>
          <Space direction="vertical">
            <Form.Item
              label={t("care.newDailyPrice")}
              name="newPrice"
              rules={[{ required: true, message: t("validation.required") }]}
              initialValue={care.dailyPrice}
            >
              <Input type="number" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default CareDetails;
