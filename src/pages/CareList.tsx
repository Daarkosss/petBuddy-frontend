import { useState, useEffect } from "react";
import { List, Button, Spin, Descriptions, Badge } from "antd";
import { CareDTO, CareStatus } from "../types/care.types";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CareList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cares, setCares] = useState<CareDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: undefined as string | undefined,
    sortDirection: undefined as string | undefined,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const statusOrder: Record<CareStatus, number> = {
    PENDING: 0,
    ACCEPTED: 1,
    AWAITING_PAYMENT: 2,
    PAID: 3,
    DONE: 4,
    CANCELLED: 6,
    OUTDATED: 6,
  };

  const fetchCares = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCares(pagingParams);
      if (data) {
        setCares(data.content.sort(sortCaresByStatus));
        setPagination({
          current: data.pageable.pageNumber + 1,
          pageSize: data.pageable.pageSize,
          total: data.totalElements,
        });
      }
    } catch (error) {
      toast.error(t("error.getCares"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCares();
    store.selectedMenuOption = "cares";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingParams]);

  const sortCaresByStatus = (a: CareDTO, b: CareDTO) => {
    return statusOrder[getCurrentUserStatus(a)] - statusOrder[getCurrentUserStatus(b)];
  }

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagingParams({
      ...pagingParams,
      page: page - 1,
      size: pageSize || 10,
    });
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

  const getCurrentUserStatus = (care: CareDTO) => {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return care.caretakerStatus;
    } else {
      return care.clientStatus;
    }
  }

  const getOtherUserStatus = (care: CareDTO) => {
    if (store.user.profile?.selected_profile === "CARETAKER") {
      return care.clientStatus;
    } else {
      return care.caretakerStatus;
    }
  }

  const getCurrentCareStatus = (care: CareDTO) => {
    switch(getCurrentUserStatus(care)) {
      case "PENDING":
        return t("careStatus.waitingForYourResponse");
      case "ACCEPTED":
        if (getOtherUserStatus(care) === "PENDING") {
          return t("careStatus.waitingForOtherResponse");
        } else {
          return t("careStatus.accepted");
        }
      case "AWAITING_PAYMENT":
        return t("careStatus.waitingToTakePlace");
      case "DONE":
        return t("careStatus.done");
      case "CANCELLED":
        return t("careStatus.cancelled");
      case "OUTDATED":
        return t("careStatus.outdated");
    }
  }

  const getCareStatusColor = (care: CareDTO) => {
    switch(getCurrentUserStatus(care)) {
      case "PENDING":
        return "orange";
      case "ACCEPTED":
        if (getOtherUserStatus(care) === "PENDING") {
          return "orange";
        } else {
          return "green";
        }
      case "AWAITING_PAYMENT":
        return "blue";
      case "DONE":
        return "gray";
      case "CANCELLED":
        return "red";
      case "OUTDATED":
        return "gray";
    }
  }

  return (
    <div className="cares-list-container">
      <Spin spinning={isLoading} />
      <h1 className="cares-title">{t("care.yourCares")}</h1>
      <List
        className="cares-list"
        dataSource={cares}
        itemLayout="vertical"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        renderItem={(care) => (
          <Badge.Ribbon text={getCurrentCareStatus(care)} color={getCareStatusColor(care)}>
            <List.Item 
              key={care.id}
              className="item"
              actions={[
                <Button
                  className="view-details-button"
                  type="primary"
                  onClick={() => navigate(`/care/${care.id}`)}
                >
                  {t("viewDetails")}
                </Button>
              ]}
              extra={
                <img src={`/images/${care.animalType.toLowerCase()}-card.jpg`}/>
              }
            >
              <List.Item.Meta
                title={t("care.fromTo", { 
                  from: care.careStart,
                  to: care.careEnd, 
                  days: numberOfDays(care.careStart, care.careEnd) 
                })}
                description={
                  <Descriptions
                    column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                    size="small"
                  >
                    <Descriptions.Item label={t("animalType")}>
                      {t(care.animalType.toLowerCase())}
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
                    <Descriptions.Item label={t("care.currentStatus")}>
                      {getCurrentCareStatus(care)}
                    </Descriptions.Item>
                  </Descriptions>
                }
              />
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </div>
  );
};

export default CareList;
