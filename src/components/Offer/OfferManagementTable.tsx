import React from "react";
import { Button, Table, Space, Popconfirm } from "antd";
import { OfferDTOWithId, OfferConfigurationWithId } from "../../types";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import store from "../../store/RootStore";
import { t } from "i18next";

type OfferManagementTableProps = {
  offers: OfferDTOWithId[];
  setOffers: React.Dispatch<React.SetStateAction<OfferDTOWithId[]>>;
  setIsOfferModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConfigModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingOffer: React.Dispatch<React.SetStateAction<OfferDTOWithId | null>>;
  setEditingConfig: React.Dispatch<React.SetStateAction<OfferConfigurationWithId | null>>;
}

const OfferManagementTable: React.FC<OfferManagementTableProps> = ({
  offers,
  setOffers,
  setIsOfferModalOpen,
  setIsConfigModalOpen,
  setEditingOffer,
  setEditingConfig,
}) => {

  const loadOffers = async () => {
    try {
      if (store.user.profile?.email) {
        const data = await api.getCaretakerDetails(store.user.profile?.email);
        setOffers(data.offers);
      }
    } catch (error) {
      toast.error(t("error.loadOffers"));
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    try {
      await api.deleteOffer(offerId);
      toast.success(t("success.deleteOffer"));
      loadOffers();
    } catch (error) {
      toast.error(t("error.deleteOffer"));
    }
  };

  const handleEditOffer = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleAddConfiguration = (offer: OfferDTOWithId) => {
    setEditingOffer(offer);
    setEditingConfig(null);
    setIsConfigModalOpen(true);
  };

  const handleEditConfiguration = (config: OfferConfigurationWithId) => {
    setEditingConfig(config);
    setIsConfigModalOpen(true);
  };

  const handleDeleteConfiguration = async (configurationId: number) => {
    try {
      await api.deleteOfferConfiguration(configurationId);
      toast.success(t("success.deleteConfiguration"));
      loadOffers();
    } catch (error) {
      toast.error(t("error.deleteConfiguration"));
    }
  };

  const expandedRowRender = (offer: OfferDTOWithId) => {
    const columns = [
      { title: t("description"), dataIndex: "description" },
      { title: t("dailyPrice"), dataIndex: "dailyPrice" },
      { 
        title: t("sex"), dataIndex: ["selectedOptions", "SEX"],
        render: (values: string[]) => values.map(value => t(value.toLowerCase())).join(", ")
      },
      { 
        title: t("size"), dataIndex: ["selectedOptions", "SIZE"],
        render: (values: string[]) => values.map(value => t(value.toLowerCase())).join(", ")
      },
      {
        title: t("manage"),
        render: (record: OfferConfigurationWithId & { id: number }) => (
          <Space size="middle">
            <Button onClick={() => handleEditConfiguration(record)}>{t("edit")}</Button>
            <Popconfirm
              title={t("deleteConfiguration")}
              description={t("confirmConfigurationDelete")}
              okText={t("yes")}
              cancelText={t("no")}
              onConfirm={() => handleDeleteConfiguration(record.id)}
            >
              <Button type="primary" danger>
                {t("delete")}
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Button
          type="primary"
          onClick={() => handleAddConfiguration(offer)}
          style={{ marginBottom: 10 }}
        >
          {t("addConfiguration")}
        </Button>
        <Table
          columns={columns}
          dataSource={offer.offerConfigurations}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  };

  return (
    <Table
      dataSource={offers}
      columns={[
        { title: t("description"), dataIndex: "description" },
        { title: t("animalType"), dataIndex: ["animal", "animalType"],
          render: (value) => t(value.toLowerCase())
        },
        { title: t("amenities"), dataIndex: "animalAmenities",
          render: (values: string[]) => values.map(value => t(`amenityTypes.${value.toLowerCase()}`)).join(", ")
        },
        { title: t("availability"), dataIndex: "availabilities" },
        {
          title: t("manage"),
          render: (offer) => (
            <Space size="middle">
              <Button onClick={() => handleEditOffer(offer)}>{t("editDescription")}</Button>
              <Button onClick={() => handleEditOffer(offer)}>{t("editAvailability")}</Button>
              <Button onClick={() => handleEditOffer(offer)}>{t("editAmenities")}</Button>
              <Popconfirm
                title={t("deleteOffer")}
                description={t("confirmOfferDelete")}
                okText={t("yes")}
                cancelText={t("no")}
                onConfirm={() => handleDeleteOffer(offer.id)}
              >
              <Button type="primary" danger disabled>
                {t("delete")}
              </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ]}
      pagination={false}
      rowKey="id"
      expandable={{
        expandedRowRender: expandedRowRender,
      }}
    />
  );
};

export default OfferManagementTable;
