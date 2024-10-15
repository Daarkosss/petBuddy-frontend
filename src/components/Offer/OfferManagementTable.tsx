import React, { ChangeEvent, useState } from "react";
import { Button, Table, Space, Popconfirm, Input } from "antd";
import { OfferDTOWithId, OfferConfigurationWithId, EditOfferDescription } from "../../types";
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
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>("");

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

  const handleEditDescription = (offer: OfferDTOWithId) => {
    setEditingKey(offer.id.toString());
    setEditedDescription(offer.description);
  };

  const handleSaveDescription = async (offer: OfferDTOWithId) => {
    try {
      const updatedOffer: EditOfferDescription = { 
        animal: offer.animal,
        description: editedDescription,
      };
      await api.addOrEditOffer(updatedOffer);
      setEditingKey(null);
      loadOffers();
      toast.success(t("success.editDescription"));
    } catch (error) {
      toast.error(t("error.editDescription"));
    }
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditedDescription("");
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

  const columns = [
    {
      title: t("description"),
      dataIndex: "description",
      render: (text: string, record: OfferDTOWithId) => {
        return editingKey === record.id.toString() ? (
          <Input
            value={editedDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedDescription(e.target.value)}
          />
        ) : (
          text
        );
      },
    },
    { title: t("animalType"), dataIndex: ["animal", "animalType"],
      render: (value: string) => t(value.toLowerCase())
    },
    { title: t("amenities"), dataIndex: "animalAmenities",
      render: (values: string[]) => values.map(value => t(`amenityTypes.${value.toLowerCase()}`)).join(", ")
    },
    { title: t("availability"), dataIndex: "availabilities" },
    {
      title: t("manage"),
      render: (offer: OfferDTOWithId) => {
        return editingKey === offer.id.toString() ? (
          <Space size="middle">
            <Button onClick={() => handleSaveDescription(offer)}>{t("save")}</Button>
            <Button onClick={handleCancelEdit}>{t("cancel")}</Button>
          </Space>
        ) : (        
          <Space size="middle">
            <Button onClick={() => handleEditOffer(offer)}>{t("edit")}</Button>
            <Button onClick={() => handleEditDescription(offer)}>{t("editDescription")}</Button>
            {/* <Button onClick={() => handleEditAvailability(offer.id)}>{t("delete")}</Button> */}
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
        )
      },
    },
  ];

  return (
    <Table
      dataSource={offers}
      columns={columns}
      pagination={false}
      rowKey="id"
      expandable={{
        expandedRowRender: expandedRowRender,
      }}
    />
  );
};

export default OfferManagementTable;
