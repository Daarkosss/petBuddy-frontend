import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space, Popconfirm } from "antd";
import { OfferDTOWithId, OfferConfigurationWithId } from "../types";
import OfferForm from "../components/OfferForm";
import { api } from "../api/api";
import { toast } from "react-toastify";
import store from "../store/RootStore";
import ConfigurationForm from "../components/OfferConfigurationForm";
import { t } from "i18next";

const OfferManagement: React.FC = () => {
  const [offers, setOffers] = useState<OfferDTOWithId[]>([]);
  const [editingOffer, setEditingOffer] = useState<OfferDTOWithId | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<OfferConfigurationWithId | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

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

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  const handleSuccessfulOfferSave = () => {
    setIsOfferModalOpen(false);
    loadOffers();
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

  const handleSaveConfiguration = async (newConfig: OfferConfigurationWithId) => {
    if (newConfig.id) {
      try {
        await api.editOfferConfiguration(newConfig.id, newConfig);
        toast.success(t("success.editConfiguration"));
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error(t("error.editConfiguration"));
      }
    } else {
      try {
        await api.addOfferConfiguration(editingOffer!.id, newConfig);
        toast.success(t("success.addConfiguration"));
        setIsConfigModalOpen(false);
        loadOffers();
      } catch (error) {
        toast.error(t("error.addConfiguration"));
      }
    }
    setEditingConfig(null);
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
    <div className="offer-management-page">
      <Button type="primary" onClick={handleAddOffer} className="add-offer-button">
        {t("addOffer")}
      </Button>
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
                <Button onClick={() => handleEditOffer(offer)}>{t("edit")}</Button>
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
      <Modal
        title={editingOffer ? t("editOffer") : t("addOffer")}
        open={isOfferModalOpen}
        onCancel={() => setIsOfferModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <OfferForm offer={editingOffer!} onSuccess={handleSuccessfulOfferSave} />
      </Modal>

      <Modal
        title={editingConfig ? t("editConfiguration") : t("addConfiguration")}
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <ConfigurationForm
          initialValues={editingConfig}
          onSuccess={handleSaveConfiguration}
        />
      </Modal>
    </div>
  );
};

export default OfferManagement;
