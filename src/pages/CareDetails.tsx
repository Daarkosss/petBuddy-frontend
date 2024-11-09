import { useState, useEffect } from "react";
import { Button, Spin, Timeline, Card, Descriptions } from "antd";
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

  const acceptCareByCaretaker = async () => {
    try {
      await api.acceptCare(careIdNumber!);
      fetchCareDetails();
    } catch (error) {
      toast.error(t("error.acceptCare"));
    }
  };

  const rejectCareByCaretaker = async () => {
    try {
      await api.rejectCare(careIdNumber!);
      fetchCareDetails();
    } catch (error) {
      toast.error(t("error.rejectCare"));
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
      // W zależności od statusu obu stron, dodajemy kolejne kroki.
      if (careStatusFromYourSide() === "PENDING") {
        items.push({
          color: "orange",
          children: t("careStatus.waitingForYourResponse")
        });
      } else if (careStatusFromOtherSide() === "PENDING") {
        items.push({
          color: "blue",
          children: t("careStatus.waitingForOtherResponse")
        });
      }
  
      // Sprawdzenie, czy status zaakceptowano z obu stron.
      if (careStatusFromYourSide() === "ACCEPTED" && careStatusFromOtherSide() === "ACCEPTED") {
        items.push({
          color: "green",
          children: t("careStatus.acceptedByCaretaker")
        });
      }

      if (careStatusFromYourSide() === "AWAITING_PAYMENT" || careStatusFromOtherSide() === "AWAITING_PAYMENT") {
        items.push({
          color: "green",
          children: t("careStatus.acceptedByCaretaker")
        });
      }
      if (careStatusFromYourSide() === "DONE" || careStatusFromOtherSide() === "DONE") {
        items.push({
          color: "green",
          children: t("careStatus.done")
        });
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
              {care.dailyPrice} zł
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
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <Button type="primary" onClick={acceptCareByCaretaker}>
                {t("care.accept")}
              </Button>
              <Button type="primary" danger onClick={rejectCareByCaretaker}>
                {t("care.reject")}
              </Button>
            </div>
          }
        </div>
      </Card>
      <img src={`/images/${care.animalType.toLowerCase()}-card.jpg`}/>
    </div>
  );
};

export default CareDetails;
