import { useState, useEffect } from "react";
import { List, Button, Spin, Descriptions, Badge } from "antd";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import store from "../store/RootStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Care } from "../models/Care";

const CareList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cares, setCares] = useState<Care[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagingParams, setPagingParams] = useState({
    page: 0,
    size: 10,
    sortBy: "submittedAt",
    sortDirection: "DESC",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCares = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCares(pagingParams);
      if (data) {
        setCares(data.content.map((care) => new Care(care)));
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

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagingParams({
      ...pagingParams,
      page: page - 1,
      size: pageSize || 10,
    });
  };

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
          <Badge.Ribbon text={care.currentStatusText} color={care.careStatusColor}>
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
                  days: care.numberOfDays
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
                      {care.totalPrice} zł
                    </Descriptions.Item>
                    <Descriptions.Item label={t("caretaker")}>
                      {care.caretakerEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("client")}>
                      {care.clientEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("care.currentStatus")}>
                      {care.currentStatusText}
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
